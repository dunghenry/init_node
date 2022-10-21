const User = require('../models/user.model');
const logEvents = require('../helpers/logEvents');
const mongoose = require('mongoose');
const { validationRegister } = require('../helpers/validateUser');
const bcrypt = require('bcrypt');
class userController {
    static async getUsers(req, res) {
        try {
            const users = await User.find({});
            const rs = users.map((user) => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                __v: user.__v,
            }));
            return res.status(200).json(rs);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
    static async getUser(req, res) {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }
        try {
            const user = await User.findById(id);
            if (user) {
                const { password, ...info } = user._doc;
                return res.status(200).json(info);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
    static async updateUser(req, res) {
        const { username, email, password } = req.body;
        const { id } = req.params;
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }
        try {
            const salt = await bcrypt.genSalt(process.env.SALT);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const user = await User.findByIdAndUpdate(
                id,
                {
                    username,
                    email,
                    password: hashedPassword,
                },
                { new: true },
            );
            const { password, ...info } = user._doc;
            return res.status(200).json(info);
        } catch (error) {
            await logEvents(error.message, module.filename);
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = userController;
