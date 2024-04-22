const jwt = require('jsonwebtoken');
const projectConfig = require('../config');
const { findUser } = require('../services/user');
const { findAdmin } = require('../services/admin');

/*
  Middleware for user authentication using JSON Web Tokens (JWT).

  - Extracts the JWT from the request headers, body, or query parameters.
  - Verifies the JWT using the secret key from the project configuration.
  - Retrieves the user information from the database based on the decoded token.
  - Sets the user information in the request object for further processing.

  @param {Object} req - Express request object.
  @param {Object} res - Express response object.
  @param {Function} next - Express next function.
*/
const userAuthentication = async (req, res, next) => {
    // Extract the JWT from various sources
    const token =
        req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization');

    // Check if a token is present
    if (!token) {
        return res.status(401).send({ message: 'A token is required for authentication' });
    }

    try {
        // Verify the JWT and decode its payload
        const decoded = jwt.verify(token, projectConfig?.jwt?.key);

        // Retrieve user information from the database
        const user = await findUser({ _id: decoded?._id, role: 'user' });

        // Check if the user exists
        if (!user) return res.status(403).send({ err: 'Invalid Token' });

        // Set the user information in the request object
        req.user = decoded;
    } catch (error) {
        console.log(error);
        return res.status(403).send({ message: 'Invalid Token' });
    }

    // Call the next middleware or route handler
    return next();
};

const interviewerAuthentication = async (req, res, next) => {
    // Extract the JWT from various sources
    const token =
        req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization');

    // Check if a token is present
    if (!token) {
        return res.status(401).send({ message: 'A token is required for authentication' });
    }

    try {
        // Verify the JWT and decode its payload
        const decoded = jwt.verify(token, projectConfig?.jwt?.key);

        // Retrieve user information from the database
        const user = await findUser({ _id: decoded?._id, role: 'interviewer' });

        // Check if the user exists
        if (!user) return res.status(403).send({ err: 'Invalid Token' });

        // Set the user information in the request object
        req.user = decoded;
    } catch (error) {
        console.log(error);
        return res.status(403).send({ message: 'Invalid Token' });
    }

    // Call the next middleware or route handler
    return next();
};
/*
  Middleware for vendor authentication using JSON Web Tokens (JWT).

  - Extracts the JWT from the request headers, body, or query parameters.
  - Verifies the JWT using the secret key from the project configuration.
  - Retrieves the vendor information from the database based on the decoded token.
  - Sets the vendor information in the request object for further processing.

  @param {Object} req - Express request object.
  @param {Object} res - Express response object.
  @param {Function} next - Express next function.
*/
const adminAuthentication = async (req, res, next) => {
    // Extract the JWT from various sources
    const token =
        req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization');

    // Check if a token is present
    if (!token) {
        return res.status(401).send({ message: 'A token is required for authentication' });
    }

    try {
        // Verify the JWT and decode its payload
        const decoded = jwt.verify(token, projectConfig?.jwt?.key);

        // Retrieve vendor information from the database
        const vendor = await findAdmin({ _id: decoded?._id });

        // Check if the vendor exists
        if (!vendor) return res.status(403).send({ err: 'Invalid Token' });

        // Set the vendor information in the request object
        req.vendor = decoded;
    } catch (error) {
        console.log(error);
        return res.status(403).send({ message: 'Invalid Token' });
    }

    // Call the next middleware or route handler
    return next();
};

// Export the authentication middleware functions
module.exports = { userAuthentication, adminAuthentication, interviewerAuthentication };
