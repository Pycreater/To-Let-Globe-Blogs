const { body } = require('express-validator');

const addBlogValidator = () => {
  return [
    body('heading').trim().notEmpty().withMessage('Heading is required'),
    body('subHeading')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Heading is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('blogCategory')
      .trim()
      .notEmpty()
      .withMessage('Blog Category is required'),
  ];
};

const updateBlogValidator = () => {
  return [
    body('heading')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Heading is required'),
    body('subHeading')
      .optional()
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Heading is required'),
    body('content')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Content is required'),
    body('blogCategory')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Blog Category is required'),
  ];
};

module.exports = {
  addBlogValidator,
  updateBlogValidator,
};
