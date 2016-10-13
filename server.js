//Call Dependencies
var express = require('express');
require('dotenv').config();
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
/*var models = global.db = require('./models');*/
//connect with mongoose
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var routes = require('./controllers/routes/index');
var userRoutes = require('./controllers/routes/user');

var app = express();

/*mongoose.connect('localhost:27017/collegiatekups');*/
/*mongoose.connect('mongodb://localhost/collegiatekups');*/
mongoose.connect('mongodb://heroku_bht27xgp:bc3f7217h43783hjousrr3dqmi@ds057476.mlab.com:57476/heroku_bht27xgp');
var db = mongoose.connection;
require('./config/passport');
// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//allows access to complete public domain
app.use(express.static(__dirname + '/public'));


//make session available for hbs
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


// Set routes 
app.use('/', routes);
app.use('/', userRoutes);
/*var htmlRoutes =require('./controllers/routes/htmlRoutes')(app);

var addCartRoutes =require('./controllers/routes/addCartRoutes.js')(app);*/
//set the port connection. Either heroku or local host 


var port = process.env.PORT || 3000;


// Launch server  
app.listen(port, function() {
    console.log("Connected to " + port);
})






