var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}else{
		res.redirect('/404');
	}
};

module.exports = function(app, passport){

	//home route
	var homeController = require('../app/controllers/homeController');
	app.get('/', homeController.index);
	app.get('/home', homeController.index);
	app.get('/trainer', ensureAuthenticated, homeController.trainer);
	app.post('/register', homeController.register);
	app.get('/logout', homeController.logout);
	app.post('/login', passport.authenticate('local', {
			successRedirect: '/trainer',
			failureRedirect: '/loginError'		
		})
	);

	var mapController = require('../app/controllers/mapController');
	app.get('/map', ensureAuthenticated, mapController.showMap);

	// check for pokemon on location
	var pokemonController = require('../app/controllers/pokemonController');
	app.get('/checkLocation', ensureAuthenticated, pokemonController.checkLocationForPokemon);
	app.get('/choosePokemon', ensureAuthenticated, pokemonController.choosePokemon);
	app.get('/choose', ensureAuthenticated, pokemonController.choose);
	app.get('/catch', ensureAuthenticated, pokemonController.catchPokemon);
	app.get('/attack', ensureAuthenticated, pokemonController.attack);

	// fight!
	app.get('/fight', ensureAuthenticated, pokemonController.fight);
	// app.get('/moveToPC', ensureAuthenticated, pokemonController.moveToPC)

};
