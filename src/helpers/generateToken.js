const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '30m',
        },
    );
};
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '365d',
        },
    );
};

module.exports = { generateAccessToken, generateRefreshToken };
