const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoURL =  require('./middleware/db').mongoURL;
const compression = require('compression');
const minify = require('express-minify');
const mailer = require('express-mailer');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// mailing setup
mailer.extend(app, {
  from: 'no-reply@feedlark.com',
  host: 'localhost',
  secureConnection: false,
  port: 25,
  transportMethod: 'SMTP'
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(compression());
app.use(minify());
app.use(express.static(path.join(__dirname, 'public')));
// Return the .ico in images when feedlark.com/favicon.ico is requested
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// express-session
//  https://github.com/expressjs/session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'g)o(r)ooodl2z8xh(5qan80517e%35dgh(_03+t%3&1*w$)t9)',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ url: mongoURL })
}));

// Load all the routing
app.use('/', require('./middleware/routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  res.status(200).render("404");
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.ENVIRONMENT != "PRODUCTION" ) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
