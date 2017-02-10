var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var session = require("client-sessions");
var index = require('./routes/index');

var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/twetter');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database Connection Successful");
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(session({
  cookieName: 'session',
  secret: 'BIGQZYFRhyWcdZl5q6cpdUpI',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/main', index.twetGET);
app.get('/', index.loginGET);
app.post('/post', index.twetPOST);
app.post('/login', index.loginPOST);

app.listen(3000);
