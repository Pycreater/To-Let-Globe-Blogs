const { body } = require('express-validator');
const User = require('../../models/auth/user.models.js');
const { AvailableUserRoles } = require('../../constants.js');

const userRegisterValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid')
      .custom(async (value) => {
        // Check if username already exists in the database
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          if (existingUser.isEmailVerified) {
            throw new Error('Email already exists');
          }
        }
      }),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLowercase()
      .withMessage('Username must be lowercase')
      .isLength({ min: 4 })
      .withMessage('Username must be at lease 4 characters long')
      .custom(async (value) => {
        // Check if username already exists in the database
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
          throw new Error('Username already exists');
        }
      }),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at lease 8 characters long'),
    body('role')
      .optional()
      .isIn(AvailableUserRoles)
      .withMessage('Invalid user role'),
  ];
};

const userLoginValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at lease 6 characters long'),
  ];
};

module.exports = {
  userRegisterValidator,
  userLoginValidator,
};
