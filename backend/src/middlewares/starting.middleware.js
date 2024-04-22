const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

/*
  Middleware for setting up the initial configurations of the Express app.

  - Uses bodyParser to parse JSON and URL-encoded data in requests.
  - Serves static files from the 'public' directory.
  - Parses incoming JSON requests.
  - Enables Cross-Origin Resource Sharing (CORS) with specific configurations:
    - Allows requests from any origin (true).
    - Specifies allowed HTTP methods.
    - Enables credentials and sets optionSuccessStatus to 200.
  - Handles errors by sending an appropriate status code and error message.

  @param {Object} app - Express app instance.
*/
const startingMiddleware = (app) => {
    // Parse JSON and URL-encoded data in requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Serve static files from the 'public' directory
    app.use(express.static('public'));

    // Parse incoming JSON requests
    app.use(express.json());

    // Enable Cross-Origin Resource Sharing (CORS)
    app.use(cors({
        origin: true,
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'PATCH', 'DELETE'],
        credentials: true,
        optionSuccessStatus: 200
    }));

    // Error handling middleware
    app.use(function (err, req, res, next) {
        if (!err.statusCode) err.statusCode = 500;
        res.status(err.statusCode).send(err.message || 'Something went wrong');
    });
};

// Export the startingMiddleware function
module.exports = startingMiddleware;
