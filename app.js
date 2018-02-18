const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Load routes
const things = require('./routes/things');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);
// Database configu
const db = require('./config/database');

// Connect to Mongoose
mongoose.connect(db.mongoURI)
	.then(() => console.log('MongoDB connected...'))
	.catch(err => console.log(err));

// Handlebars middleware
app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	helpers: {
		ifvalue: function (conditional, options) {
		  if (options.hash.value === conditional) {
		    return options.fn(this)
		  } else {
		    return options.inverse(this);
		  }
		},
		formatDate: function (date) {
		  if(date != null) {
		  	return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
		  } else {
		  	return "";
		  }
		}
	}
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Methog override middleware. override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

// parse application/json
app.use(bodyParser.json());

// Index route
app.get('/', (req, res) => {
	const title = 'Welcome';
	res.render('index', {
		title: title
	});
});

// About route
app.get('/about', (req, res) => {
	res.render('about');
});

// Use routes
app.use('/things', things);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`Server start on port ${port}`);
});