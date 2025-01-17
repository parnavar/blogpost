const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashPassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).json({
                status: "fail",
                message: "User not Found."
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password);
        if (isCorrect) {
            req.session.user = user; //assigning user object to session to persist login info.
            res.status(200).json({
                status: "success"
            })
        }
        else {
            res.status(400).json({
                status: "fail",
                message: "incorrect username or password"
            })
        }
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}