/*
  User Account Controller

  - Provides functions for retrieving user information, updating user details, and changing passwords.
  - Uses user service functions for database interactions.
  - Implements validation for account information and password change.
  - Handles different scenarios, such as validation errors, password matching, and database update failures.

  @module User Account Controller
*/

// Import necessary modules and configurations
const {
  findUser, findUserWithPassword, updateUser,
} = require('../../services/user');
const { hashValue, compareHash } = require('../../utils/auth');
const { accountInfoValidation } = require('../../validations/user');
const { changePasswordValidation, changePasswordOTPValidation } = require('../../validations/common');
const UserModel = require('../../models/user');
const { getPresignedUrl, uploadImage, randomImageName } = require('../../utils/s3');
const { sendEmail } = require('../../utils/send-email');
const { commonEmailTemplate } = require('../../utils/email-template');

// Function to retrieve user information
async function me(req, res) {
  const user = await findUser({ _id: req.user?._id });
  if (user.image) {
    user.image = await getPresignedUrl(user.image);
  }
  return res.status(201).json({ success: true, data: user });
}

// Function to update user details
async function update(req, res) {
  try {
    // Validate customer account information
    const validation = accountInfoValidation(req.body);
    if (validation.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    let image = null;
    if (req.file) {
      image = randomImageName() + req.file.originalname;
      const uploadRes = await uploadImage(image, req.file);
      if (!uploadRes) {
        return res.status(400).json({ success: false, message: 'Failed to upload profile image' });
      }
    }

    const user = await updateUser({ _id: req.user?._id }, {
      ...req.body,
      ...(image && { image }),
    });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Failed to update user information' });
    }

    if (user.image) {
      user.image = await getPresignedUrl(user.image);
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

async function changePasswordSendOTP(req, res) {
  try {
    // Validate password change information
    const validation = changePasswordOTPValidation(req.body);
    if (validation.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    // Find user with password for comparison
    const user = await findUserWithPassword({ _id: req.user?._id });
    const passwordMatch = await compareHash(req.body.currentPassword, user.password);

    // Check if the current password matches
    if (!passwordMatch) {
      return res.status(422).json({ success: false, message: 'Current password does not match' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const updatedUser = await updateUser({ _id: req.user?._id }, { otp: otp });
    if (!updatedUser) {
      return res.status(400).json({ success: false, message: 'Failed to change password' });
    }

    // Send the reset password email
    const template = commonEmailTemplate(otp, new Date().toLocaleDateString());
    sendEmail(user.email, 'Change Password OTP', template);

    return res.json({ success: true, data: { message: 'OTP send on your email address' } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

// Function to change user password
async function changePassword(req, res) {
  try {
    // Validate password change information
    const validation = changePasswordValidation(req.body);
    if (validation.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    // Find user with password for comparison
    const user = await findUserWithPassword({ _id: req.user?._id });
    // Check if the otp match or not
    if (user.otp !== req.body.otp) {
      return res.status(422).json({ success: false, message: 'Invalid OTP' });
    }

    const passwordMatch = await compareHash(req.body.currentPassword, user.password);

    // Check if the current password matches
    if (!passwordMatch) {
      return res.status(422).json({ success: false, message: 'Current password does not match' });
    }

    // Hash the new password and update user in the database
    const hashPassword = await hashValue(req.body.newPassword);
    const updatedUser = await updateUser({ _id: req.user?._id }, { password: hashPassword, otp: null });

    // Check if the password update was successful
    if (!updatedUser) {
      return res.status(400).json({ success: false, message: 'Failed to change password' });
    }

    return res.json({ success: true, data: { message: 'Password changed' } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

const getCoin = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findOne({ _id: userId }).lean();

    const resp = {
      success: true,
      data: {
        coin: user.score
      },
    };
    return res.json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
};

// Export the me, update, and changePassword functions
module.exports = { me, update, changePassword, getCoin, changePasswordSendOTP };
