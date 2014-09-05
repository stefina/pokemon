var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Attack = mongoose.model('Attack'),
	AttackSchema = require('./attack'),
	Client = require('node-rest-client').Client,
	client = new Client();

var maxAttacksNumber = 4;

var PokemonSchema = new Schema({
	name: String,
	id: String,
	pokedexId: String,
	description: String,
	imgFront: String,
	imgBack: String,
	hp: { type: Number, min: 0, max: 100, default: 100 },
	ep: { type: Number, min: 0, default: 100 },
	lvl: { type: Number, min: 1, max: 100, default: 12 },
	attacks: [AttackSchema],
	pokemonTypes: [String] // TODO: ENUM here
});

PokemonSchema.virtual('date')
	.get(function(){
    	return this._id.getTimestamp();
	});

// MAPPING-FUNCTIONS
PokemonSchema.virtual('toPokemonObj').set(function (apiPokemon) {
	this.id = this._id;
	this.name = apiPokemon.name;
	this.pokedexId =  apiPokemon.pkdx_id;
	var pokeTypeArray = new Array();
	apiPokemon.types.forEach(function(type) {
		pokeTypeArray.push(type.name);
	});
	var pokeAbilitiesArray = new Array();
	apiPokemon.abilities.forEach(function(ability) {
		var attack = new Attack();
		attack.mapAbility = ability;
		pokeAbilitiesArray.push(attack);
	});
	this.attacks = pokeAbilitiesArray;
	this.ep = apiPokemon.exp;
	this.pokemonTypes = pokeTypeArray;
	this.imgFront = 'img/pokemon/main-sprites/red-blue/' + this.pokedexId + '.png';
	this.imgBack = 'img/pokemon/main-sprites/red-blue/back/' + this.pokedexId + '.png';
	this.save();
	console.log('MongoDB saved Pokemon ' + this.name + ' to the database.');
});


PokemonSchema.virtual('takeHit').set(function (attackId) {
	var hurt = 10;
	// TODO: properly handle an attack by attack-attributes
	this.hp = this.hp - hurt;
	console.log(this.name + ' got hit and lost ' + hurt + ' HP.');
	this.save();
});

PokemonSchema.methods.addAttack = function (attack) {
	this.attacks.push(attack);
	if(this.attacks.length < maxAttacksNumber) {
		this.attacks.push(attack);
	}
	console.log(this.name + ' learned attack "' + attack.name + '".');
	this.save();
}

PokemonSchema.statics.findByPokedexId = function(pkdx_id, callback) {
	getPokemonByPokedexId(pkdx_id, function(err, pokemon){
		callback(null, pokemon);
	});
}

PokemonSchema.statics.getRandomPokemon = function (callback) {

	var rand = Math.floor(Math.random() * 151) + 1;

	getPokemonByPokedexId(rand, function(err, pokemon){
		callback(null, pokemon);
	});
}

PokemonSchema.statics.checkArea = function (natural, callback) {

	var rand = Math.floor(Math.random() * 151) + 1;

	getPokemonByPokedexId(rand, function(err, pokemon){
		for(var i = 0; i < pokemon.pokemonTypes.length; i++){
			if(pokemon.pokemonTypes[i] == natural){
				console.log('match: ' + pokemon);
				callback(null, pokemon);
			}
		}
		// callback(null, null);
	});
}

var getPokemonByPokedexId = function(id, callback){

	client.get('http://pokeapi.co/api/v1/pokemon/' + id + '/', function(data, response){
		var pokemon = new Pokemon();

		pokemon.toPokemonObj = data;
		
		callback(null, pokemon);
	});
}


var Pokemon = mongoose.model('Pokemon', PokemonSchema);
mongoose.model('Pokemon', PokemonSchema);
