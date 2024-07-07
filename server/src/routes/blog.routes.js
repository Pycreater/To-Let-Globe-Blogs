const { Router } = require('express');
const router = Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require('../controllers/blog.controllers.js');

const { upload } = require('../middlewares/multer.middlewares.js');
const {
  addBlogValidator,
  updateBlogValidator,
} = require('../validators/blog.validators.js');
const {
  mongoIdPathVariableValidator,
} = require('../validators/mongodb.validators.js');
const { validate } = require('../validators/validate.js');
const {
  verifyJWT,
  verifyPermission,
} = require('../middlewares/auth.middlewares.js');
const { UserRolesEnum } = require('../constants.js');

// secure routes
router.use(verifyJWT);

router
  .route('/')
  .get(getAllBlogs)
  .post(
    verifyPermission([UserRolesEnum.CONTENT_WRITER, UserRolesEnum.ADMIN]),
    upload.single('blogImage'),
    addBlogValidator(),
    validate,
    createBlog
  );
router.route('/self/blogs').get(getMyBlogs);
router.route('/');

router
  .route('/:blogId')
  .get(mongoIdPathVariableValidator('blogId'), validate, getBlogById)
  .patch(
    verifyPermission([UserRolesEnum.CONTENT_WRITER, UserRolesEnum.ADMIN]),
    upload.single('blogImage'),
    mongoIdPathVariableValidator('blogId'),
    updateBlogValidator(),
    validate,
    updateBlog
  )
  .delete(
    verifyPermission([UserRolesEnum.CONTENT_WRITER, UserRolesEnum.ADMIN]),
    mongoIdPathVariableValidator('blogId'),
    validate,
    deleteBlog
  );

module.exports = router;
