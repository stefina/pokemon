var mongoose = require('mongoose'),
	Pokemon = mongoose.model('Pokemon'),
	Trainer = mongoose.model('Trainer'),
	osmRead = require('osm-read');

exports.checkLocationForPokemon = function(req, res){
	var node = req.query.location;

	var latitude = node.loc_latitude;
	var longitude = node.loc_longitude;

	// create a rectangle
	var longitude_a, longitude_b, latitude_a, latitude_b;
	longitude_a = round(longitude);
	longitude_b = round(longitude) + 0.1;
	latitude_a = round(latitude);
	latitude_b = round(latitude) + 0.1;

	var doThis = 0;


	osmRead.parse({
		// url: 'http://overpass-api.de/api/interpreter?data=node(51.93315273540566%2C7.567176818847656%2C52.000418429293326%2C7.687854766845703)%5Bhighway%3Dtraffic_signals%5D%3Bout%3B',
		url: 'http://overpass-api.de/api/interpreter?data=node%28' + latitude_a + '%2C' + longitude_a + '%2C' + latitude_b + '%2C' + longitude_b + '%29%5B%22natural%22%5D%3Bout%20body%3B%0A',
		format: 'xml',
		// endDocument: function(){
		// 	console.log('document end');
		// },
		// bounds: function(bounds){
		// 	console.log('bounds: ' + JSON.stringify(bounds));
		// },
		node: function(node){
			// console.log('node: ' + JSON.stringify(node));
			if(doThis < 10){
				doThis++;
				Pokemon.checkArea(getNatural(node), function(err, pokemon) {
					res.json({ location: node, pokemon: pokemon });
				});
			}
		},
		// way: function(way){
		// 	console.log('way: ' + JSON.stringify(way));
		// },
		error: function(msg){
			console.log('error: ' + msg);
		}
	});

};

exports.choosePokemon = function(req, res){
	res.render('home/choosePokemon', { trainer: req.user });
};

exports.choose = function(req, res){
	Trainer.findById(req.user._id, function(err, trainer){
		if(trainer.pokemonCaptured.length == 0){
			Pokemon.findByPokedexId(req.query.pk, function(err, pokemon){
				trainer.capturePokemon(pokemon);
				res.render('home/trainer', { trainer: trainer });
			});
		} else {
			var warning = "Don't be greedy!"
			res.render('home/trainer', { warning: warning, trainer: trainer });
		}
	});
	
};

exports.attack = function(req, res){
	var attackId = req.query.attackId;
	var enemyPokemonId = req.query.enemyPokemonId;
	var trainerPokemonId = req.query.trainerPokemonId;


	Pokemon.findById(enemyPokemonId, function(err, enemyPokemon){
		Pokemon.findById(trainerPokemonId, function(err, trainerPokemon){
			enemyPokemon.takeHit = attackId;
			res.render('fight/pokemonFight', { trainerPokemon: trainerPokemon, enemyPokemon: enemyPokemon });
		});
	});

	// // TODO: do Attack
	// res.render('fight/pokemonFight', {layout: false, trainerPokemon: trainerPokemon, enemyPokemon: pokemon});
	// // res.json({ trainerPokemon: trainerPokemon, enemyPokemon: pokemon });
}

exports.catchPokemon = function(req, res){
	Trainer.findById(req.user._id, function(err, trainer){
		Pokemon.findById(req.query.id, function(err, pokemon){
			trainer.capturePokemon(pokemon);
			res.render('home/trainer', { trainer: trainer });
		});
	});
	
};

exports.fight = function(req, res){
	var pokemonId = req.query.pokemon;
	Pokemon.findById(pokemonId, function(err, pokemon){
		Trainer.findById(req.user._id, function(err, trainer){
			var trainerPokemon = trainer.pokemonTeam[0];
			
			res.render('fight/pokemonFight', { trainerPokemon: trainerPokemon, enemyPokemon: pokemon });
		});
	});
}

function getNatural(node){
	var natural = node.tags.natural;
	if (natural){
		if(natural == 'tree'){
			return 'grass';
		}
	} else {
		console.log('No natural features found.');
		return null;
	}
}

function round(val){
	return Math.round(val*100000)/100000;
}

// exports.moveToPC = function(req, res) {
	// TODO: move Pokemon from team	to PC
// }