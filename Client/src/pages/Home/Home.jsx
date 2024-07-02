import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Header } from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../../contextApi/AuthContext";

export const Home = () => {
  const [items, setItems] = useState([]);
  const { name, setName } = useContext(Authcontext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getItems"); // Replace with your API endpoint
        setItems(response.data);
        console.log(response.data,"data");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleOrderFunction = async (foodId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/userlogin");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/orders", {
        userId,
        foodId,
      });

      console.log("Order response:", response.data);
      navigate("/myorders");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div>
      <Header />
      <h1 className="text-2xl mt-10 sm:text-3xl font-bold text-center mb-8">
        {name ? `Hi ${name}!` : "Hi user!"} Welcome
        <span role="img" aria-label="tasty face">
          😋
        </span>
        Order Your Favorite Foods
      </h1>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 p-7  lg:grid-cols-4 gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-md p-4 mb-4"
            style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
          >
            <img
              className="w-full h-48 object-cover "
              src={item.imageUrl}
              alt={item.name}
            />
            <div className="mt-4 p-4">
              <h2 className="font-bold text-lg">{item.foodName}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xl">₹{item.price}</span>
                <button
                  onClick={() => handleOrderFunction(item._id)}
                  className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
