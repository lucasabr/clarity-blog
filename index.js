if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
//Basic App Init
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const emailer = require('./emailer');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' });
const sharp = require('sharp');
const { uploadFile, deleteFile } = require('./s3');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('source'));
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
);
const defaultAvatar =
	'https://mysuperspecial-aws-bucket.s3.amazonaws.com/newblank-profile-picture-png.png';
const defaultAvatarKey = 'newblank-profile-picture-png.png';
//Database Init
const mongoose = require('mongoose');
const User = require('./models/user');
const uri =
	'mongodb+srv://lucasabr:topsecretpassword123@lucas-database.ckz0z.mongodb.net/website-test?retryWrites=true&w=majority';
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(result => app.listen(PORT))
	.catch(err => console.log(err));

//Passport Init
const passport = require('passport');
const initializePass = require('./passport-config');
initializePass(passport);
app.set('view-engine', 'ejs');
app.use(flash());
app.use(
	session({
		secret: 'secretcode',
		resave: true,
		saveUninitialized: true,
	}),
);
app.use(cookieParser('secretcode'));
app.use(passport.initialize());
app.use(passport.session());

//Routes and Requests
app.post('/login', (req, res, next) =>
	passport.authenticate('local', (err, user, info) => {
		if (err) throw err;
		if (!user)
			res.send({
				success: false,
				msg: info,
				user: {},
			});
		else {
			req.logIn(user, err => {
				if (err) console.log(err);
				const userInformation = {
					email: req.user.email,
					confirmed: req.user.confirmed,
					setupFinished: req.user.setupFinished,
					name: req.user.username,
					description: req.user.description,
					private: req.user.private,
				};
				res.send({
					success: true,
					msg: '',
					user: userInformation,
				});
			});
		}
	})(req, res, next),
);

app.post('/register', (req, res) => {
	User.isMailUnique(req.body.email, async function (isUnique) {
		if (!isUnique) {
			res.send({
				success: false,
				msg: 'Error! There already exists an account with this email.',
			});
			res.end();
		} else {
			try {
				const hashedPassword = await bcrypt.hash(req.body.password, 10);
				User.create(req.body.email, hashedPassword, false, false, defaultAvatar, defaultAvatarKey);
				res.send({
					success: true,
					msg: 'Account Successfully created.',
				});
				res.end();
			} catch (e) {
				console.log(e);
				res.send({
					success: false,
					msg: 'Server Error.',
				});
				res.status(404).end();
			}
		}
	});
});

app.post('/confirmation', (req, res) => {
	User.findOne({ email: req.body.email }).then(user => {
		if (!user) {
			res.send({
				success: false,
				msg: 'No account exists with the provided email',
			});
		} else if (user.confirmed) {
			res.send({
				success: false,
				msg: 'The following account has already been confirmed',
			});
		} else {
			email.sendEmail(user.email, user.id);
			res.send({
				success: true,
				msg: 'Confirmation sent to your email!',
			});
		}
	});
});

app.get('/confirmation/:token', (req, res) => {
	jwt.verify(req.params.token, process.env.EMAIL_SECRET, (err, decoded) => {
		if (err) {
			res.send({
				success: false,
				msg: 'This confirmation link has expired. Enter your email below to confirm your account.',
			});
		} else {
			User.confirmUser(decoded.id, function cb(err) {
				if (err)
					res.send({
						success: false,
						msg: err,
					});
				else
					res.send({
						success: true,
						msg: 'Your account is now confirmed!',
					});
			});
		}
	});
});
app.delete('/logout', (req, res) => {
	req.session.destroy(function (err) {
		res.send('Success!');
	});
});

app.post('/updateAccount', (req, res) => {
	User.isNameUnique(req.body.username, success => {
		if (success) {
			User.updateAccount(
				req.body.email,
				req.body.username,
				req.body.description,
				req.body.private,
				function cb(err, user) {
					if (err)
						res.send({
							success: false,
							msg: err,
						});
					else
						res.send({
							success: true,
							msg: 'Your account is updated',
							user: user,
						});
				},
			);
		} else {
			res.send({
				success: false,
				msg: 'Username already taken',
			});
		}
	});
});

app.post('/updateImage', upload.single('image'), (req, res) => {
	const newPath = 'uploads/newPhoto.jpg';
	const newFile = {
		path: newPath,
		filename: `new${req.file.originalname}`,
	};
	sharp(req.file.buffer)
		.resize({ height: 250, width: 250 })
		.toFile(newPath)
		.then(async () => {
			const result = await uploadFile(newFile);
			console.log(result.Location);
			await unlinkFile(newPath);
			User.findOne({ email: req.body.email }).then(async user => {
				if (user.avatarKey !== defaultAvatarKey) await deleteFile(user.avatarKey);
				User.updateAvatar(user.email, result, (err, user) => {
					if (err) {
						res.send({
							success: false,
							msg: err,
						});
					} else {
						res.send({
							success: true,
							msg: '',
							user: user,
						});
					}
				});
			});
		});
});

app.get('/accounts/:username', (req, res) => {
	User.getAccount(req.params.username, (user, success) => {
		if (success) {
			res.send({
				success: true,
				msg: '',
				user: user,
			});
		} else {
			res.send({
				success: false,
				msg: 'user does not exist',
			});
		}
	});
});
