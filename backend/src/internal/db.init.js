/*
  Database Connection Setup.

  - Imports necessary modules and configurations.
  - Establishes a connection to the MongoDB database using Mongoose.
  - Defines event handlers for different connection events (connected, disconnected, reconnected, error).

  @module Database Connection
*/

// Import necessary modules and configurations
const projectConfig = require('../config');
const mongoose = require('mongoose');

// Enable strict query mode for Mongoose
mongoose.set('strictQuery', true);

// Function to connect to the MongoDB database
const connectToDatabase = async () => {
  // Mongoose Connection Information
  mongoose.connect(projectConfig.db.url);

  // Event handler for successful connection
  mongoose.connection.on('connected', () => {
    console.info('Success! Connected to Database.');
  });

  // Event handler for database disconnection
  mongoose.connection.on('disconnected', () => {
    console.error('!!!!!!!!!! Database Disconnected !!!!!!!!!!');
  });

  // Event handler for database reconnection
  mongoose.connection.on('reconnected', () => {
    console.warn('!!!!!!!!!! Database Reconnected  !!!!!!!!!!');
  });

  // Event handler for database connection error
  mongoose.connection.on('error', (error) => {
    console.error('Failed! Database connection failed. \n', error);
  });
};

// Export the connectToDatabase function
module.exports = connectToDatabase;
