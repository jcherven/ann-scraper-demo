const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    articleId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    byLine: {
        type: String,
        required: true
    },
    subhead: {
        type: String
    },
    previewText: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    imageLink: {
        type: String
    }
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = NewsItem;

//  articleId: articleId,
//  title: title,
//  imageLink: imageLink,
//  byLine: byLine,
//  link: link,
//  subhead: subhead,
//  previewText: previewText