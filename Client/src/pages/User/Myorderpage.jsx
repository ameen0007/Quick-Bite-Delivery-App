import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import axios from "axios";

export const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3000/getOrderedFoods?userId=${userId}`
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/cancelOrder/?orderId=${orderId}`,
        {
          status: "Cancelled",
        }
      );
      updateOrderStatus(orderId, "Cancelled");
      console.log("Order cancelled:", response.data);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order._id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
    });
  };

  return (
    <div>
      <Header />
      {orders.length > 0 && (
        <h1 className=" mt-9 text-3xl font-bold text-center mb-8">
          My Orders 😋
        </h1>
      )}
      <div className="container mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-3xl font-bold text-center mb-8">
            You have no orders <span>😞</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden shadow-md p-4`}
                style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
              >
                {order.status === "Cancelled" && (
                  <div className="absolute inset-0 bg-black opacity-25"></div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">{order.foodName}</h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${getStatusColor(
                      order.status
                    )} rounded-md`}
                  >
                    {order.status}
                  </span>
                </div>
                <img
                  className="w-full h-36 object-cover mb-4 rounded-md"
                  src={order.imageUrl}
                  alt={order.foodName}
                />
                <p className="text-gray-600 mb-2">
                  Order Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2 font-bold">
                  Price: ₹{order.price}
                </p>
                <div className="flex justify-between items-center mb-2">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-white hover:text-black border border-black transition-colors duration-200"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    case "Pickup":
      return "bg-blue-500 text-white";
    default:
      return "bg-yellow-500 text-gray-800";
  }
};
