var express = require('express');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var auth = require('./auth');
var config = require('../config/config');

// Set up password auth
passport.use(new LocalStrategy({
	usernameField: 'nickname',
	passwordField: 'password'
}, auth.authenticate));

passport.serializeUser(auth.serializeTrainer);
passport.deserializeUser(auth.deserializeTrainer);



module.exports = function(app, config, express) {
	var SessionStore = require('../app/modules/mongooseSession')(express);
	var store = new SessionStore({
	    url: config.db_uri_session,
	    interval: 120000 // expiration check worker run interval in millisec (default: 60000)
	});

	app.configure(function () {
		app.use(express.static(config.root + '/dist'));
		app.set('port', config.port);
		app.set('views', config.root + '/app/views');
		app.set('view engine', 'jade');
		app.use(express.favicon(config.root + '/public/img/favicon.ico'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({
			secret: '53Cr3T',
			store: store
		}));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(function(req, res, next){
			res.locals.user = req.user;
			next();
		});
		app.use(app.router);
		app.use(function(req, res) {
			res.status(404).render('404', { title: '404' });
		});
	});

	return passport;
};