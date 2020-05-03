const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	}, (email, password, done) => {
	User.findOne({ email: email }, (err, user) => {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.verifyPassword(password)) { console.log('hihihi');return done(null, false); }
		return done(null, user);
	});
}));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  User.findOne({_id: id}, (err, user) => {
		if (err) return cb(err);
		cb(null, user);
	})
});
