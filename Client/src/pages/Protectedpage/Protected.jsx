import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Authcontext } from "../../contextApi/AuthContext";

export const UserProtectedRoute = ({ children }) => {
  const { userAuth } = useContext(Authcontext);
  if (!userAuth) {
    return <Navigate to="/userlogin" replace />;
  }
  return children;
};

export const DeliveryPartnerProtectedRoute = ({ children }) => {
  const { deliveryPartnerAuth } = useContext(Authcontext);
  if (!deliveryPartnerAuth) {
    return <Navigate to="/deliveryPartnerLogin" replace />;
  }
  return children;
};

export const UserPublicRoute = ({ children }) => {
  const { userAuth } = useContext(Authcontext);
  if (userAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const DeliveryPartnerPublicRoute = ({ children }) => {
  const { deliveryPartnerAuth } = useContext(Authcontext);
  if (deliveryPartnerAuth) {
    return <Navigate to="/deliveryPartnerHome" replace />;
  }
  return children;
};

export const AdminProtectedRoute = () => {
  const value = localStorage.getItem("isAdmin") === "true";
  if (!value) {
    console.log("admiauth false in protected ");
    return <Navigate to="/adminlogin" />;
  }
  console.log("admiauth true in protected");
  return <Outlet />;
};
