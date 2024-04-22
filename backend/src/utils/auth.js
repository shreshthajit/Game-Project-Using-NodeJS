const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const projectConfig = require('../config')

// generateToken:
// Generates a JWT containing user information.
// Uses the jsonwebtoken library to sign the token.
// Configures the token with the user's ID and email.
// Adds an expiration time based on the configuration.

const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, projectConfig?.jwt?.key, {
        expiresIn: projectConfig?.jwt?.expire,
    })
}

// hashValue:
// Generates a salt using bcrypt.genSaltSync(10).
// Hashes the provided value using bcrypt.hash.
// Returns the hashed value.
const hashValue = async (value) => {
    const salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(value, salt);
}

// compareHash:
// Compares an old (previously hashed) value with a new value.
// Used typically during user authentication to compare stored hashed passwords with newly provided passwords.

const compareHash = async (oldValue, value) => {
    return await bcrypt.compare(oldValue, value);
}

// Function to generate a random reset token (UUID)
const generateResetToken = () => {
    return crypto.randomUUID();
};

module.exports = { generateToken, hashValue, compareHash, generateResetToken };