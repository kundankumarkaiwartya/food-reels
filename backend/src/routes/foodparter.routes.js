const express = require("express");
const { authuserMiddleware, authfoodpartnermiddleware } = require("../middleware/auth.middleware");
const router = express.Router();
const foodpartnerController = require("../controller/food-partner.controller")

router.get("/dashboard",
    authfoodpartnermiddleware, 
    foodpartnerController.getStoreDashboard
)

router.get("/profile/me",
    authfoodpartnermiddleware,
    foodpartnerController.getBusinessProfile
)

const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
});

router.put("/profile",
    authfoodpartnermiddleware,
    upload.fields([
        { name: 'coverImage', maxCount: 1 },
        { name: 'logoImage', maxCount: 1 }
    ]),
    foodpartnerController.updateBusinessProfile
)

router.get("/:id",
    authuserMiddleware,
    foodpartnerController.getfoodpartnerById
)

module.exports = router;
