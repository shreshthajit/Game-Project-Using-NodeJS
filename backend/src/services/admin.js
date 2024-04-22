// Import the AdminModel schema
const AdminModel = require('../models/admin');

// Function to add a new Admin to the database
const addAdmin = async (data) => {
    try {
        // Create a new Admin using the AdminModel schema
        const createdAdmin = await AdminModel.create(data);

        // Extract the Admin data as a plain JavaScript object, excluding the password field
        const newAdmin = createdAdmin?.toJSON();
        delete newAdmin?.password;

        return newAdmin;
    } catch (error) {
        console.log(error);
        return null; // Return null if an error occurs
    }
}

// Function to find a single Admin based on the provided query, excluding the password field
const findAdmin = async (query) => {
    try {
        // Find a single Admin that matches the provided query, excluding the password field
        return await AdminModel.findOne(query).select('-password').lean();
    } catch (error) {
        console.log(error);
        return null; // Return null if an error occurs
    }
}

// Function to find a single Admin (including the password field) based on the provided query
const findAdminWithPassword = async (query) => {
    try {
        // Find a single Admin that matches the provided query, including the password field
        return await AdminModel.findOne(query).lean();
    } catch (error) {
        console.log(error);
        return null; // Return null if an error occurs
    }
}

// Function to update a Admin based on the provided query and data, excluding the password field
const updateAdmin = async (query, data) => {
    try {
        // Find and update the Admin that matches the provided query, excluding the password field
        return await AdminModel.findOneAndUpdate(query, { $set: data }, { new: true }).select('-password').lean();
    } catch (error) {
        console.log(error);
        return null; // Return null if an error occurs
    }
}

// Function to find a single Admin based on the provided query, excluding the password field
const getAdmins = async (query) => {
    try {
        // Find a single Admin that matches the provided query, excluding the password field
        return await AdminModel.find(query).select('-password').lean();
    } catch (error) {
        console.log(error);
        return null; // Return null if an error occurs
    }
}

// Export the Admin service functions
module.exports = { addAdmin, findAdmin, updateAdmin, findAdminWithPassword, getAdmins };