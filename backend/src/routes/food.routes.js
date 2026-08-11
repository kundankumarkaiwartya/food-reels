const express = require("express");
const router = express.Router();
const foodController = require("../controller/food.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");



const upload = multer({
    storage: multer.memoryStorage(),
});


router.post("/like", authMiddleware.authuserMiddleware, foodController.likeFood)

router.post("/comment",
    authMiddleware.authuserMiddleware,
    foodController.commentFood)

router.get("/comment/:foodId", foodController.getComments)

router.post("/", authMiddleware.authfoodpartnermiddleware,
    authMiddleware.requireProfileSetup,
    upload.single("video"),
    foodController.createFood);

router.get("/like/:foodId", foodController.getlike)
router.get("/", foodController.getfooditem);


router.post("/createfoodcard", authMiddleware.authfoodpartnermiddleware, authMiddleware.requireProfileSetup, upload.single("image"), foodController.createfoodCard)

// Specific routes MUST come before wildcard routes!
router.post("/cart", authMiddleware.authuserMiddleware, foodController.toggleCartItem)
router.get("/cart", authMiddleware.authuserMiddleware, foodController.getCartItems)

router.get("/getfoodcard", foodController.getfoodCard)
router.get("/profile", authMiddleware.authuserMiddleware, foodController.getUserProfile)

// Wildcard route should be at the bottom
router.post("/:foodCardId", authMiddleware.authfoodpartnermiddleware, foodController.deletefoodcard)

module.exports = router;


