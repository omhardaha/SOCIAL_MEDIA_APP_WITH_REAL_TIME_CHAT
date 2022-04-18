const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const FollowerModel = require("../models/FollowerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const userPng =  "https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png";
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req, res) => {
	const { username } = req.body.params;
	try {
		if (username.legth < 1) return res.status(401).send("Invalid !");
		if (!regexUserName.test(username)) return res.status(401).send("Invalid !");
		const user = UserModel.findOne({ username: username.toLowercase() });
		if (user) return res.status(401).send("UserName Already Taken !");
		return res.status(200).send("Available");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server Error");
	}
});

router.post("/", async (req, res) => {
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
		let user = UserModel.findOne({ email: email.toLowercase() });
		if (user) return res.status(401).send("User Already Regsitered !");
		uset = new UserModel({
			name,
			email: email.toLowercase(),
			username: username.toLowercase(),
			password,
			profilePicUrl  : req.body.profilePicUrl || userPng,
		});
		// if (username.legth < 1) return res.status(401).send("Invalid !");
		// if (!regexUserName.test(username)) return res.status(401).send("Invalid !");
		// const user = UserModel.findOne({ username: username.toLowercase() });
		// if (user) return res.status(401).send("UserName Already Taken !");
		// return res.status(200).send("Available");
	} catch (error) {
		console.log(error);
		return res.status(500).send("Server Error");
	}
});
