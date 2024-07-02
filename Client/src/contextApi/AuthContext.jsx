import React, { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const Authcontext = createContext();

export const Authprovider = ({ children }) => {
  const [name, setName] = useState("");
  const [userAuth, setUserAuth] = useState(false);
  const [deliveryPartnerAuth, setDeliveryPartnerAuth] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLocal = () => {
      const adminAuthFromStorage = !localStorage.getItem("isAdmin") === "true";

      setAdminAuth(adminAuthFromStorage);
    };

    checkLocal();
    const interval = setInterval(checkLocal, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const checkToken = () => {
      const userToken = Cookies.get("userAccessToken");
      const deliveryPartnerToken = Cookies.get("deliveryPartnerAccessToken");

      setUserAuth(!!userToken);
      setDeliveryPartnerAuth(!!deliveryPartnerToken);
    };

    checkToken();
    const interval = setInterval(checkToken, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const userLogout = () => {
    Cookies.remove("userAccessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    setUserAuth(false);
    navigate("/");
    setName("");
  };

  const deliveryPartnerLogout = () => {
    Cookies.remove("deliveryPartnerAccessToken");
    localStorage.removeItem("deliverypartner");
    localStorage.removeItem("deliverypartnername");
    setDeliveryPartnerAuth(false);
    navigate("/deliveryPartnerLogin");
  };

  const adminLogout = () => {
    localStorage.removeItem("isAdmin");
    setAdminAuth(false);
    navigate("/adminlogin");
  };

  return (
    <Authcontext.Provider
      value={{
        adminAuth,
        setAdminAuth,
        name,
        setName,
        userAuth,
        deliveryPartnerAuth,
        userLogout,
        deliveryPartnerLogout,
        adminLogout,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};
