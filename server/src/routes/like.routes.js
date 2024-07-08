const { Router } = require('express');
const router = Router();
const {
  toggleLike,
  getMyLikedBlogs,
} = require('../controllers/like.controllers.js');

const { verifyJWT } = require('../middlewares/auth.middlewares.js');
const {
  mongoIdPathVariableValidator,
} = require('../validators/mongodb.validators');
const { validate } = require('../validators/validate.js');

// all routes are secured

router.use(verifyJWT);

router
  .route('/:blogId')
  .post(mongoIdPathVariableValidator('blogId'), validate, toggleLike);

router.route('/self').get(getMyLikedBlogs);
module.exports = router;
