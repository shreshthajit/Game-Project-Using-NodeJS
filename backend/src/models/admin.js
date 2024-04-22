

const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // For reset password
  resetPasswordToken: String,
  resetPasswordExpireTime: Number,
}, {
  // Include timestamps for record creation and modification
  timestamps: true,
  versionKey: false,
});

// Create a Admin model using the schema
const AdminModel = mongoose.model('Admin', AdminSchema);

// Export the Admin model
module.exports = AdminModel;
