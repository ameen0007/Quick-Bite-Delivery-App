import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  AdminProtectedRoute,
  UserPublicRoute,
  UserProtectedRoute,
  DeliveryPartnerPublicRoute,
  DeliveryPartnerProtectedRoute,
} from './pages/Protectedpage/Protected';

// Import your components
import { Home } from "./pages/Home/Home";
import { Adminlogin } from "./pages/Admin/Adminlogin";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { UserRegister } from "./pages/User/UserRegister";
import { Userlogin } from "./pages/User/Userlogin";
import { MyOrderPage } from "./pages/User/Myorderpage";
import { DeliveryPartnerRegister } from "./pages/DeliveryBoy/RiderRegister";
import { DeliveryPartnerLogin } from "./pages/DeliveryBoy/RiderLogin";
import { DeliveryPartnerHome } from "./pages/DeliveryBoy/Ridehome";
import { UserOrderActivity } from "./pages/Admin/UserorderActivity";
import { DeliveryPartnerActivity } from "./pages/Admin/DeliveryPartnerActivity";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/adminlogin" element={<Adminlogin />} />
        <Route element={<AdminProtectedRoute/>}>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/useractivity" element={<UserOrderActivity />} />
        <Route path="/deliverypartneractivity" element={<DeliveryPartnerActivity />} />
        </Route>

        <Route path="/usersignup" element={<UserPublicRoute><UserRegister /></UserPublicRoute>} />
        <Route path="/userlogin" element={<UserPublicRoute><Userlogin /></UserPublicRoute>} />
        <Route path="/myorders" element={<UserProtectedRoute><MyOrderPage /></UserProtectedRoute>} />

        <Route path="/deliveryPartnerRegister" element={<DeliveryPartnerPublicRoute><DeliveryPartnerRegister /></DeliveryPartnerPublicRoute>} />
        <Route path="/deliveryPartnerLogin" element={<DeliveryPartnerPublicRoute><DeliveryPartnerLogin /></DeliveryPartnerPublicRoute>} />
        <Route path="/deliveryPartnerHome" element={<DeliveryPartnerProtectedRoute><DeliveryPartnerHome /></DeliveryPartnerProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
