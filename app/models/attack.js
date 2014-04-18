var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AttackSchema = new Schema({
	name: { type: String, required: true, index: { unique: true } }
});

AttackSchema.virtual('date')
	.get(function(){
    	return this._id.getTimestamp();
	});

// MAPPING-FUNCTIONS
AttackSchema.virtual('mapAbility').set(function (ability) {
	this.name = ability.name;
	
	this.save();
	console.log('MongoDB saved Attack ' + this.name + ' to the database.');
});

var Attack = mongoose.model('Attack', AttackSchema);
mongoose.model('Attack', AttackSchema);