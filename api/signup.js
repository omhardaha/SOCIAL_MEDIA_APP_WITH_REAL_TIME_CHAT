const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const userPng =
	"https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req, res) => {
	const { username } = req.params;
    console.log(username)
	try {
		if (username.legth < 1) return res.status(401).send("Invalid !");
		if (!regexUserName.test(username)) return res.status(401).send("Invalid !");
		const user =await UserModel.findOne({ username: username.toLowerCase() });
        console.log(user)
		if (user) return res.status(401).send("UserName Already Taken !");
		return res.status(200).send("Available");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server Error");
	}
});

router.post("/", async (req, res) => {
	console.log("sdf  f ");
	const {
		name,
		email,
		username,
		password,
		bio,
		facebook,
		youtube,
		twitter,
		instagram,
	} = req.body.user;

	if (!isEmail(email)) return res.status(401).send("Invalid Email!");
	if (password.legth < 6) return res.status(401).send("Invalid Password!");
	try {
		let user = UserModel.findOne({ email: email.toLowerCase() });
		console.log(user);
		if (user.username) return res.status(401).send("User Already Regsitered !");
		user = new UserModel({
			name,
			email: email.toLowerCase(),
			username: username.toLowerCase(),
			password,
			profilePicUrl: req.body.profilePicUrl || userPng,
		});
		user.password = await bcrypt.hash(password, 10);
		await user.save();
		// console.log();
		let profileFields = {};
		profileFields.user = user._id;

		profileFields.bio = bio;

		profileFields.social = {};
		if (facebook) profileFields.social.facebook = facebook;
		if (youtube) profileFields.social.youtube = youtube;
		if (instagram) profileFields.social.instagram = instagram;
		if (twitter) profileFields.social.twitter = twitter;

		await new ProfileModel(profileFields).save();
		await new FollowerModel({
			user: user._id,
			followers: [],
			following: [],
		}).save();

		const payload = { userId: user._id };
		jwt.sign(payload, process.env.SECREYKEY, (err, token) => {
			if (err) throw err;
			res.status(200).json(token);
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server Error");
	}
});

module.exports = router;
