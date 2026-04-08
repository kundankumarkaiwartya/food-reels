const foodpartnerModel = require("../models/foodpartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authfoodpartnermiddleware(req, res, next) {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "null" || token === "undefined") {
        console.log("No token found");
        return res.status(401).json({
            message: "login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Payload:", decoded);

        const foodpartner = await foodpartnerModel.findById(decoded.id);

        if (!foodpartner) {
            console.log("Food partner not found for ID:", decoded.id);
            return res.status(401).json({
                message: "food partner not found"
            });
        }

        req.foodpartner = foodpartner;
        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({
            message: "invalid token"
        })
    }
}


async function authuserMiddleware(req, res, next) {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "null" || token === "undefined") {
        return res.status(401).json({
            message: "please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "user not found"
            });
        }

        req.user = user

        next();

    } catch (err) {

        return res.status(401).json({
            message: "invalid token"
        })
    }
}

async function redirectIfLoggedIn(req, res, next) {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token && token !== "null" && token !== "undefined") {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Check if user exists to be sure
            const user = await userModel.findById(decoded.id);
            if (user) {
                return res.status(403).json({
                    message: "User is already logged in"
                });
            }
            next();
        } catch (err) {
            next();
        }
    } else {
        next();
    }
}

async function redirectIfPartnerLoggedIn(req, res, next) {
    let token = req.cookies.token;
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token && token !== "null" && token !== "undefined") {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Specifically check the foodpartner model
            const partner = await foodpartnerModel.findById(decoded.id);
            if (partner) {
                return res.status(403).json({
                    message: "Food Partner is already logged in"
                });
            }
            next();
        } catch (err) {
            next();
        }
    } else {
        next();
    }
}


async function requireProfileSetup(req, res, next) {
    const partner = req.foodpartner;
    if (!partner) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!partner.phone || !partner.address || !partner.operatingHours) {
        return res.status(403).json({ 
            message: "INCOMPLETE_PROFILE",
            error: "You must complete your business profile (phone, address, operating hours) before uploading food or reels." 
        });
    }

    next();
}

module.exports = {
    authfoodpartnermiddleware,
    authuserMiddleware,
    redirectIfLoggedIn,
    redirectIfPartnerLoggedIn,
    requireProfileSetup
}

