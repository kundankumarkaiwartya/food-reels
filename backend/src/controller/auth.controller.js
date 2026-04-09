const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const foodpartnerModel = require("../models/foodpartner.model");


async function registerUser(req, res) {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields (fullName, email, password) are required" });
        }

        const isUserAreadyExist = await userModel.findOne({ email });

        if (isUserAreadyExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedpassword
        });

        const token = jwt.sign({
            id: user._id
        },
            process.env.JWT_SECRET,
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: "user register successfully",
            token: token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({
            id: user._id,
        },
            process.env.JWT_SECRET,
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        return res.status(200).json({
            message: "user logged in successfully",
            token: token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({
        message: "user logged out successfully"
    })
}

async function registerFoodpartner(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields (name, email, password) are required" });
        }

        const isFoodpartnerAlreadyExist = await foodpartnerModel.findOne({ email });

        if (isFoodpartnerAlreadyExist) {
            return res.status(400).json({ message: "Food partner already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const foodpartner = await foodpartnerModel.create({
            name,
            email,
            password: hashpassword
        });

        const token = jwt.sign({
            id: foodpartner._id
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: "Food partner registered successfully",
            token: token,
            foodpartner: {
                _id: foodpartner._id,
                email: foodpartner.email,
                name: foodpartner.name
            }
        });
    } catch (error) {
        console.error("Food partner registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginFoodpartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const foodpartner = await foodpartnerModel.findOne({ email });
        if (!foodpartner) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foodpartner.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({
            id: foodpartner._id,
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Food partner logged in successfully",
            token: token,
            foodpartner: {
                _id: foodpartner._id,
                email: foodpartner.email,
                name: foodpartner.name
            }
        });
    } catch (error) {
        console.error("Food partner login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function logoutFoodpartner(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    res.status(200).json({
        message: "Logged out successfully"
    });
}
module.exports = {
    registerUser,
    loginUser,
    logout,
    registerFoodpartner,
    loginFoodpartner,
    logoutFoodpartner
}