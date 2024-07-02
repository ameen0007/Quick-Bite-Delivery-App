import React, { useContext } from "react";
import { FaRightFromBracket } from "react-icons/fa6";
import { Authcontext } from "../../contextApi/AuthContext";

export const Adminheader = () => {
  const { adminLogout } = useContext(Authcontext);

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold">Quick Bite</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="bg-black text-white py-2 px-4 border-white border-opacity-50 hover:text-gray-400 hover:border-black hover:border-opacity-50 flex items-center"
        >
          <FaRightFromBracket className="h-6 w-6 mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};
