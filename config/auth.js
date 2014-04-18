var mongoose = require('mongoose'),
	Trainer = mongoose.model('Trainer');
var ObjectId = mongoose.Types.ObjectId;

module.exports = {
	authenticate: function(nickname, password, done){
		Trainer.findOne({ 'nickname': nickname }, function(err, trainer) {
			if(err || !trainer){
				return done(err, null);
			} else {
				trainer.checkPassword(password, function(err, passwordCorrect){
					if(err || !passwordCorrect){
						return done(err, null);
					} else {
						done(null, trainer);
					}
				});
			}
		});
	},

	serializeTrainer: function(trainer, done){
		done(null, trainer._id.toString());
	},

	deserializeTrainer: function(trainerId, done){
		Trainer.findById(ObjectId(trainerId), function(err, trainer){
			if(err || !trainer){
				return done(err, null);
			} else {
				return done(null, trainer);
			}
		});
	}
}