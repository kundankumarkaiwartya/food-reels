const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const foodpartnerRoutes = require("./routes/foodparter.routes");
const orderRoutes = require("./routes/order.routes");
const cors = require("cors");



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://food-reels-three.vercel.app"],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/foodpartner', foodpartnerRoutes);
app.use('/api/order', orderRoutes);


module.exports = app;