var createError = require( 'http-errors' );
var express = require( 'express' );
var path = require( 'path' );
var logger = require( 'morgan' );
const helmet = require( 'helmet' );
const exphbs = require( 'express-handlebars' );

const mongoose = require( 'mongoose' );
const axios = require( 'axios' );
const cheerio = require( 'cheerio' );

const db = require( './models' );


var app = express();
app.use( helmet() );

// view engine setup
app.engine( 'handlebars', exphbs( { defaultLayout: 'main' } ) );
app.set( 'view engine', 'hbs' );

// Middleware
app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// Route handling
const indexRouter = require( './routes/index-route' );
const scrapeRouter = require('./routes/fetch-route');

app.use( '/', indexRouter );
app.use( '/', scrapeRouter );

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/annStories";
mongoose.connect( MONGODB_URI, { useNewUrlParser: true } );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
    next( createError( 404 ) );
} );

// error handler
app.use( function ( err, req, res, next ) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

    // render the error page
    res.status( err.status || 500 );
    res.render( 'error' );
} );

module.exports = app;
