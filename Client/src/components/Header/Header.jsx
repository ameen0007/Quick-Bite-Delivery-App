import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authcontext } from '../../contextApi/AuthContext';
import { RiShoppingBag4Fill } from 'react-icons/ri';
import { FaRightFromBracket } from 'react-icons/fa6';

export const Header = () => {
  const navigate = useNavigate();
  const {userLogout, userAuth } = useContext(Authcontext);

  const handleRegisterPage = () => {
    navigate('/usersignup');
  };

  const handleLoginPage = () => {
    navigate('/userlogin');
  };

  const handleMyOrders = () => {
    navigate('/myorders');
   
  };

  const handleLogout = () => {
    userLogout()
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className="text-xl font-bold">Quick Bite</span>
      </div>
      <div className="flex items-center space-x-4">
        {userAuth ? (
          <>
            <button
              onClick={handleMyOrders}
              className="text-white hover:text-gray-400 focus:outline-none"
            >
              <RiShoppingBag4Fill className="h-6 w-6" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-black text-white py-2 px-4 border-white border-opacity-50 hover:text-gray-400 hover:border-black hover:border-opacity-50 flex items-center"
            >
              <FaRightFromBracket className="h-6 w-6 mr-2" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleRegisterPage}
              className="bg-white text-black py-2 px-4 rounded-full border border-black border-opacity-50 hover:bg-black hover:text-white hover:border-white hover:border-opacity-50"
            >
              Signup
            </button>
            <button
              onClick={handleLoginPage}
              className="bg-black text-white py-2 px-4 rounded-full border border-white border-opacity-50 hover:bg-white hover:text-black hover:border-black hover:border-opacity-50"
            >
              Login
            </button>
          </>
        )}
      </div>
    </header>
  );
};
