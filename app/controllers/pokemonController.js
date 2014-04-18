var mongoose = require('mongoose'),
	Pokemon = mongoose.model('Pokemon'),
	Trainer = mongoose.model('Trainer');

exports.checkLocationForPokemon = function(req, res){
	var node = req.query.location;
	// console.log(node);

	Pokemon.checkArea(node, function(err, pokemon) {
		res.json({ location: node, pokemon: pokemon });
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

// exports.moveToPC = function(req, res) {
	// TODO: move Pokemon from team	to PC
// }