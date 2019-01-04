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
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
    