const { Router } = require('express');
const router = Router();
const {
  userRegister,
  userLogin,
  userLogout,
  userSelf,
} = require('../../controllers/auth/user.controllers.js');

const {
  userRegisterValidator,
  userLoginValidator,
} = require('../../validators/auth/user.validators.js');
const { validate } = require('../../validators/validate.js');
const { verifyJWT } = require('../../middlewares/auth.middlewares.js');

//unsecured routes
router.route('/register').post(userRegisterValidator(), validate, userRegister);
router.route('/login').post(userLoginValidator(), validate, userLogin);

// Secured Routes
router.route('/logout').get(verifyJWT, userLogout);
router.route('/self').get(verifyJWT, userSelf);

module.exports = router;
