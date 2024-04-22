/*
  Authentication Controller

  - Provides functions for user signup, login, and token verification.
  - Uses validation, hashing, and JWT token generation.
  - Handles different scenarios, such as existing user check, password validation, and token verification.

  @module Authentication Controller
*/

// Import necessary modules and configurations
const { userSignUpValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, googleValidation, userSignUpOTPValidation } = require('../../validations/auth');
const jwt = require('jsonwebtoken');
const projectConfig = require('../../config');
const {
  findUser, addUser, findUserWithPassword, updateUser, addOTP, getOTP, updateOTP, deleteOTP,
} = require('../../services/user');

const { hashValue, compareHash, generateToken, generateResetToken } = require('../../utils/auth');
const { forgotPasswordEmailTemplate, commonEmailTemplate } = require('../../utils/email-template');
const { sendEmail } = require('../../utils/send-email');
const ONE_HOUR = 3600000; // 1 hour = 3600000 milliseconds

// Function to handle user signup
async function signup(req, res) {
  // Validate user information
  const validation = userSignUpOTPValidation(req.body);
  if (validation.error) {
    return res.status(422).json({ success: false, message: validation.error.details[0].message });
  }

  // Check if the user already exists
  const userExists = await findUser({ email: req.body.email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email already exists.' });
  }

  const validOTP = await getOTP({ email: req.body.email, otp: req.body.otp, expireTime: { $gt: Date.now() } });
  if (!validOTP) {
    return res.status(400).json({ success: false, message: 'OTP expired or invalid OTP.' });
  }

  // Hash the password
  const hashedPassword = await hashValue(req.body.password);

  // Save user into the database
  const user = await addUser({ ...req.body, password: hashedPassword });
  if (!user) {
    return res.status(400).json({ success: false, message: 'Failed to sign up. Please try again after some times' });
  }

  deleteOTP({ email: req.body.email });
  return res.status(201).json({ success: true, data: user });
}

// Function to handle user signup otp
async function sendOTP(req, res) {
  // Validate user information
  const validation = userSignUpValidation(req.body);
  if (validation.error) {
    return res.status(422).json({ success: false, message: validation.error.details[0].message });
  }

  // Check if the user already exists
  const [userExists, otpExists] = await Promise.all([
    await findUser({ email: req.body.email }),
    await getOTP({ email: req.body.email })
  ]);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email already exists.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const user = otpExists ? await updateOTP({ email: req.body.email }, {
    otp,
    expireTime: Date.now() + 5 * 60 * 1000, // 5 * 60 * 1000 means 5 minutes,
  }) : await addOTP({
    ...req.body, otp,
    expireTime: Date.now() + 5 * 60 * 1000, // 5 * 60 * 1000 means 5 minutes,
  });
  if (!user) {
    return res.status(400).json({ success: false, message: 'Failed to send email otp' });
  }

  // Send the reset password email
  const template = commonEmailTemplate(otp, new Date().toLocaleDateString(), 'register your account');
  sendEmail(req.body.email, 'Email Verification OTP', template);

  return res.json({ success: true, data: { message: 'OTP send on your email address' } });
}

// Function to handle user login
async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    // Validate login information
    const validation = loginValidation(req.body);
    if (validation.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    // Find user with password
    const [user, userInfo] = await Promise.all([
      await findUserWithPassword({ email, role }),
      await findUser({ email, role })
    ]);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = generateToken(user);
    if (req.body?.fcmToken) {
      updateUser({ _id: user._id }, { fcmToken: req.body?.fcmToken })
    }
    return res.json({ success: true, data: { token, ...userInfo } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

// Function to handle user login
async function googleSignIn(req, res) {
  try {
    const { email } = req.body;

    // Validate login information
    // const validation = googleValidation(req.body);
    // if (validation.error) {
    //   return res.status(422).json({ success: false, message: validation.error.details[0].message });
    // }

    // Find user with password
    const user = await findUser({ email });
    if (user) {
      // Generate a JWT token
      const token = generateToken(user);
      if (req.body?.fcmToken || req.body?.photoURL) {
        updateUser({ _id: user._id }, { ...(req.body?.fcmToken && { fcmToken: req.body.fcmToken }), ...(req.body?.photoURL && { socialImage: req.body.photoURL }) })
      }
      return res.json({ success: true, data: { token, ...user } });
    } else {
      let password = email + '&&';
      // Hash the password
      const hashedPassword = await hashValue(password);

      // Save user into the database
      const user = await addUser({ ...req.body, password: hashedPassword, role: 'user', ...(req.body?.photoURL && { socialImage: req.body?.photoURL }) });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Failed to sign in with google' });
      }
      // Generate a JWT token
      const token = generateToken(user);
      delete user?.password;
      return res.json({ success: true, data: { token, ...user } });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

// Function to check user authentication using a token
const checkAuth = async (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization');

  if (!token) {
    return res.status(401).send({ message: 'A token is required for authentication' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, projectConfig?.jwt?.key);

    // Find user based on the decoded token
    const user = await findUser({ _id: decoded?._id });
    if (!user) return res.status(403).send({ message: 'Invalid Token' });

    return res.status(200).send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: 'Invalid Token' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const validation = forgotPasswordValidation(req.body);
    if (validation.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    const user = await findUser({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email not exists' });
    }

    // Generate a reset token
    const resetToken = generateResetToken();
    const data = {
      resetPasswordToken: resetToken,
      resetPasswordExpireTime: Date.now() + ONE_HOUR,
    };

    const updatedUser = await updateUser({ _id: user._id }, data);
    if (!updatedUser) {
      return res.status(400).json({ success: false, message: 'Forgot password failed' });
    }

    // Create a reset URL and email template
    const resetUrl = projectConfig.application.baseUrl + '/reset-password/' + resetToken;
    const template = forgotPasswordEmailTemplate(resetUrl);

    // Send the reset password email
    sendEmail(email, 'Reset Password Link', template);
    return res.json({ data: { message: 'Reset password email sent' } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    // Validate all information using the resetPasswordValidation function
    const validation = resetPasswordValidation(req.body);
    if (validation.error) {
      // Return a 422 Unprocessable Entity status and error message if validation fails
      return res.status(422).json({ error: validation.error.details[0].message });
    }

    // Verify the user's reset token and check if it's still valid
    const user = await findUser({ resetPasswordToken: token, resetPasswordExpireTime: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await hashValue(password);

    // Update the user's password and reset token information
    const data = await updateUser({ _id: user._id }, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpireTime: null
    });
    if (!data) {
      return res.status(400).json({ error: 'Password Reset Failed' });
    }

    return res.json({ data: { message: 'Password reset successfully' } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}

// Export the signup, login, forgotPassword, resetPassword, and checkAuth functions
module.exports = { signup, login, checkAuth, forgotPassword, resetPassword, googleSignIn, sendOTP };
