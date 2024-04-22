const { loginValidation, adminSignUpValidation, adminLoginValidation} = require('../../validations/auth');
const jwt = require('jsonwebtoken');
const projectConfig = require('../../config');
const {
  findAdmin, addAdmin, findAdminWithPassword,
} = require('../../services/admin');
const { hashValue, compareHash, generateToken } = require('../../utils/auth');

// Function to handle Admin signup
async function signup(req, res) {
  // Validate Admin information
  const validation = adminSignUpValidation(req.body);
  if (validation.error) {
    return res.status(422).json({ success: false, message: validation.error.details[0].message });
  }

  // Check if the Admin already exists
  const adminExists = await findAdmin({ email: req.body.email });
  if (adminExists) {
    return res.status(400).json({ success: false, message: 'Email already exists.' });
  }

  // Hash the password
  const hashedPassword = await hashValue(req.body.password);

  // Save Admin into the database
  const admin = await addAdmin({ ...req.body, password: hashedPassword });
  if (!admin) {
    return res.status(400).json({ success: false, message: 'Failed to sign up' });
  }

  return res.status(201).json({ success: true, data: admin });
}


// Function to handle Admin login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate login information
    const validation = adminLoginValidation(req.body);
    if (validation.error) {
      return res.status(422).json({ success: false, message: validation.error.details[0].message });
    }

    // Find Admin with password
    const admin = await findAdminWithPassword({ email });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await compareHash(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = generateToken({
      ...admin,
      role: 'admin',
    });
    return res.status(200).json({ success: true, data: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || 'Something went wrong' });
  }
}


// Function to check Admin authentication using a token
const checkAuth = async (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization');

  if (!token) {
    return res.status(401).send({ message: 'A token is required for authentication' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, projectConfig?.jwt?.key);

    // Find Admin based on the decoded token
    const admin = await findAdmin({ _id: decoded?._id });
    if (!admin) return res.status(403).send({ message: 'Invalid Token' });

    return res.status(200).send({ success: true, data: admin });
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: 'Invalid Token' });
  }
}

// Export the signup, login, and checkAuth functions
module.exports = { signup, login, checkAuth };
