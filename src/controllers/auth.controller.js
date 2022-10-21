const User = require('../models/user.model');
const logEvents = require('../helpers/logEvents');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../helpers/generateToken');
const bcrypt = require('bcrypt');
const {
    validationRegister,
    validationLogin,
} = require('../helpers/validateUser');
class authController {
    static async register(req, res) {
        const { username, email, password } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required!' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Email is required!' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required!' });
        }
        const { error } = validationRegister(req.body);
        if (error) {
            return res
                .status(400)
                .json({ message: 'Invalid username or email or password!' });
        }
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                return res
                    .status(400)
                    .json({ message: 'Email already exists!' });
            } else {
                const salt = await bcrypt.genSalt(+process.env.SALT);
                const hashedPassword = await bcrypt.hash(
                    req.body.password,
                    salt,
                );
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                });
                const savedUser = await newUser.save();
                const { password, ...info } = savedUser._doc;
                return res.status(201).json(info);
            }
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required!' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required!' });
        }
        const { error } = validationLogin(req.body);
        if (error) {
            return res
                .status(400)
                .json({ message: 'Invalid email or password!' });
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found!' });
            }
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password,
            );
            if (!isValidPassword) {
                return res
                    .status(400)
                    .json({ message: 'Password is invalid!' });
            }
            const { password, ...info } = user._doc;
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'strict',
                maxAge: 365 * 24 * 60 * 60 * 60,
            });
            return res.status(200).json({ ...info, accessToken });
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = authController;
