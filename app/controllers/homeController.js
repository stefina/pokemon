var mongoose = require('mongoose'),
	Pokemon = mongoose.model('Pokemon'),
	Trainer = mongoose.model('Trainer');
var ObjectId = require('mongoose').Types.ObjectId;

exports.index = function(req, res){
	// Pokemon.getRandomPokemon(function(err, pokemon) {
		res.render('home/index', { user: req.user });
	// });
};

exports.trainer = function(req, res){
	res.render('home/trainer', { trainer: req.user });
};

exports.register = function(req, res){
	var trainerData = {
		nickname : req.body.nickname
	};
	var password = req.body.password;
	Trainer.createWithPassword(trainerData, password, function(err, trainer){
		if(err || !trainer){
			res.redirect('/404');
		} else {
			req.login(trainer, function(err){
				if(err){
					res.redirect('/404');
				} else {

					res.redirect('/choosePokemon');
				}
			});
		}
	});
};

exports.logout = function(req, res){
	req.logout();
	res.redirect('/home');
};

exports.login = function(req, res, passport){
	console.log('User ' + req.user.nickname + ' logged in.');
};