var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var GeoLocationSchema = new Schema({
	// longitude: Long,
	// latitude: Long
});

GeoLocationSchema.virtual('date')
	.get(function(){
    	return this._id.getTimestamp();
	});

// MAPPING-FUNCTIONS
GeoLocationSchema.virtual('setGeolocation').set(function (location) {
	// this.name = ability.name;
	

	// TODO: GEOLOCATION

	// this.save();
	// console.log('MongoDB saved GeoLocation ' + this.name + ' to the database.');
});

var GeoLocation = mongoose.model('GeoLocation', GeoLocationSchema);
mongoose.model('GeoLocation', GeoLocationSchema);