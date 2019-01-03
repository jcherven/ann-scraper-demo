const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

router.get("/fetch-new", (req, res) => {
    console.log("\n***********************************\n" +
                "Fetching the front page of ANN News" +
                "\n***********************************\n");

    const baseUrl = "https://www.animenewsnetwork.com";
    const newsUrl = "/news";

    axios.get(baseUrl + newsUrl).then(function(response) {
        var $ = cheerio.load(response.data);
        var results = [];

        // Cheerio scraping
        $("div.herald").each((i, element) => {
            let imageLink = baseUrl + $(element).find("div.thumbnail").attr("data-src");
            let title = $(element).find("h3").text().trim();
            let byLine = $(element).find("time").text();
            let link = baseUrl + newsUrl + $(element).find("div.wrap").find("a").attr("href");
            let subhead = $(element).find("span.intro").text().trim();
            let previewText = $(element).find("span.full").text().trim();
            let articleId = $(element).attr("data-topics");

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                articleId: articleId,
                title: title,
                imageLink: imageLink,
                byLine: byLine,
                link: link,
                subhead: subhead,
                previewText: previewText
            });
        });

        // Log the results once you've looped through each of the elements found with cheerio
        //   console.log(results);
        results.forEach((newsItem) => {
            console.log(newsItem.articleId);
            console.log(newsItem.title);
            console.log(newsItem.byLine);
            console.log(newsItem.imageLink);
            console.log(newsItem.subhead + " " + newsItem.previewText);
            console.log(newsItem.link);
            console.log("\n");
        });
        res.redirect('/');
    });
});

module.exports = router;