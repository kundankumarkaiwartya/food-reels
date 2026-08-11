import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserLogin from "../pages/UserLogin";
import UserRegister from "../pages/UserRegister";
import PartnerLogin from "../pages/PartnerLogin";
import PartnerRegister from "../pages/PartnerRegister";
import Home from "../pages/home";
import Foodcreate from "../pages/foodcreate/foodcreate";
import Profile from "../pages/food-profile/profile";
import Feed from "../pages/food-profile/feed";
import FoodNavbar from "../components/foodnavbar";
import UserNavbar from "../components/usernavbar";
import Foodcardcreate from "../pages/foodcreate/foodcardcreate"
import Showfood from "../pages/food-profile/showfood";
import Order from "../pages/food-profile/order";
import UserProfile from "../pages/food-profile/user.profile";
import BusinessProfile from "../pages/foodcreate/bussiness.profile";
import Favorites from "../pages/food-profile/favourite";
import UserAddress from "../pages/food-profile/user.address";
import Setting from "../pages/food-profile/setting";
import Store from "../pages/foodcreate/store";




// This component re-runs every time the URL changes
// So it will always read the LATEST role from localStorage
const NavbarSelector = () => {
    const location = useLocation(); // This forces re-render on every page change
    const role = localStorage.getItem('role') || 'user';

    // Don't show any navbar on login/register, detail pages, or home
    const hideOnPaths = ['/user/login', '/user/register', '/foodpartner/login', '/foodpartner/register', '/home'];
    const isFoodDetailPage = location.pathname.startsWith('/food/');


    if (hideOnPaths.includes(location.pathname) || isFoodDetailPage) {
        return null;
    }


    // Choose which navbar to show
    return role === 'foodpartner' ? <FoodNavbar /> : <UserNavbar />;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Navigate to="/feed" /> : children;
};

const AppRoutes = () => {

    return (
        <Router>
            <NavbarSelector />
            <Routes>
                <Route path="/" element={<Navigate to="/feed" />} />
                <Route path="/user/register" element={<PublicRoute><UserRegister /></PublicRoute>} />
                <Route path="/user/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
                <Route path="/foodpartner/register" element={<PartnerRegister />} />
                <Route path="/foodpartner/login" element={<PartnerLogin />} />
                <Route path="/home" element={<Home />} />

                <Route path="/create-food" element={<Foodcreate />} />
                <Route path="/food-partner/:id" element={<Profile />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/activeorders" element={<Order />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/foodcard" element={<Foodcardcreate />} />
                <Route path="/store" element={<Store />} />
                <Route path="/bussiness-profile" element={<BusinessProfile />} />
                <Route path="/favourites" element={<Favorites />} />
                <Route path="/address" element={<UserAddress />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/food/:id" element={<Showfood />} />
            </Routes>

        </Router>
    );
}

export default AppRoutes;
