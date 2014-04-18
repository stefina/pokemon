var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Pokemon = mongoose.model('Pokemon'),
	PokemonSchema = require('./pokemon'),
	bcrypt = require('bcrypt');
var teamSize = 6;

var TrainerSchema = new Schema({
	nickname: { type: String, required: true, index: { unique: true } },
	passwordHash: { type: String },
	pokemonCaptured: { type: [PokemonSchema] },
	pokemonTeam: { type: [PokemonSchema] }
});

TrainerSchema.virtual('date')
	.get(function(){
    	return this._id.getTimestamp();
	});

// MAPPING-FUNCTIONS
TrainerSchema.virtual('createDefaultTrainer').set(function (trainerData) {
	this.nickname = trainerData;
	
	this.save();
	console.log('MongoDB saved Trainer ' + this.nickname + ' to the database.');
});

TrainerSchema.methods.capturePokemon = function (pokemon) {
	this.pokemonCaptured.push(pokemon);
	if(this.pokemonTeam.length < teamSize) {
		this.pokemonTeam.push(pokemon);
	}
	console.log('Trainer ' + this.nickname + ' captured a ' + pokemon.name + '.');
	this.save();
}

TrainerSchema.methods.movePokemonToPC = function (pokemon, callback) {
	console.log(this.pokemonTeam.indexOf(pokemon));

	this.save();
}

TrainerSchema.methods.checkPassword = function (password, callback) {
	bcrypt.compare(password, this.passwordHash, callback);
}

TrainerSchema.statics.createWithPassword = function (trainerData, password, callback) {
	
	// hash the password and create the user
	bcrypt.hash(password, 10, function(err, hash) {
		trainerData.passwordHash = hash;
		this.create(trainerData, callback);
	}.bind(this)
	);

}

var Trainer = mongoose.model('Trainer', TrainerSchema);
mongoose.model('Trainer', TrainerSchema);
