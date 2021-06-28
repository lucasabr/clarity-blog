const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/user');

function initialize(passport) {
	const authenticateUser = async (email, password, done) => {
		//Match User
		User.findOne({ email: email }).then(user => {
			if (!user) {
				return done(null, false, 'No user with that email');
			}
			//Match password
			bcrypt.compare(password, user.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					if (!user.confirmed) return done(null, false, 'Your account is not yet confirmed');
					else return done(null, user);
				} else return done(null, false, 'Password incorrect');
			});
		});
	};
	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => {
		User.findOne({ _id: id }, (err, user) => {
			const userInformation = {
				email: user.email,
				confirmed: user.confirmed,
				setupFinished: user.setupFinished,
			};
			done(err, userInformation);
		});
	});
}

module.exports = initialize;
