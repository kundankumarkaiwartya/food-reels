const express = require("express");
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");



const router = express.Router();

router.post('/user/register', authMiddleware.redirectIfLoggedIn, authController.registerUser);
router.post('/user/login', authMiddleware.redirectIfLoggedIn, authController.loginUser);
router.get('/user/logout', authController.logout);

//auth for foodpartner 
router.post('/foodpartner/register', authMiddleware.redirectIfPartnerLoggedIn, authController.registerFoodpartner);
router.post('/foodpartner/login', authMiddleware.redirectIfPartnerLoggedIn, authController.loginFoodpartner);

router.get('/foodpartner/logout', authController.logoutFoodpartner);



module.exports = router;
