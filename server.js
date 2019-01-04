const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3000;

const app = express();

// View engine config
app.engine('handlears', exphbs( {defaultLayout: 'main'}));
app.set('view engine', 'hbs');

// Middleware config
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/annScraperDemo";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res) {
    const baseUrl = "https://www.animenewsnetwork.com";
    const newsUrl = "/news";
    axios.get(baseUrl + newsUrl).then( function(response) {
        var $ = cheerio.load(response.data);
        var result = {};

        // Cheerio scraping
        $("div.herald").each((i, element) => {
            result.imageLink = baseUrl + $(element)
                .find("div.thumbnail")
                .attr("data-src");
            result.title = $(element)
                .find("h3")
                .text()
                .trim();
            result.byLine = $(element)
                .find("time")
                .text();
            result.link = baseUrl + $(element)
                .find("div.wrap")
                .find("a")
                .attr("href");
            result.subhead = $(element)
                .find("span.intro")
                .text()
                .trim();
            result.previewText = $(element)
                .find("span.full")
                .text()
                .trim();
            result.articleId = $(element)
                .attr("data-topics");

            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    return res.json(err);
            });
        });
        res.redirect("/");
    });
});

app.get("/articles", (req, res) => {
    db.Article.find({}).sort({ byLine: -1})
        .then( (dbArticle) => {
            res.json(dbArticle);
        })
        .catch( (err) => {
            res.json(err);
        });
});

app.get("/articles/:id", (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then( (dbArticle) => {
            res.json(dbArticle);
        })
        .catch( (err) => {
            res.json(err);
        });
});

app.post("/articles/:id", (res, req) => {
    db.Note.create(req.body)
        .then( (dbNote) => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {note: dbNote._id }, {new: true});
        })
        .then( (dbArticle) => {
            res.json(dbArticle);
        })
        .catch( (err) => {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("annscraper-nonmodular running on " + PORT);
});
