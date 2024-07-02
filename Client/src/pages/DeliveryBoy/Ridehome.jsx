import React, { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Deliverypartnerheader } from "../../components/Header/Deliverypartnerheader";

export const DeliveryPartnerHome = () => {
  const [userName, setUserName] = useState("");
  const [userRealName, setUserRealName] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem("deliverypartner");
    const storedUserRealName = localStorage.getItem("deliverypartnername");
    if (storedUserRealName) {
      setUserRealName(storedUserRealName);
    } else {
      navigate("/deliveryPartnerLogin");
    }
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      navigate("/deliveryPartnerLogin");
    }

    // Fetch orders from the backend API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/deliveryPartner/getdeliveryData"
        );
        setOrders(response.data.orders);
      } catch (error) {
        setError(error.message); // Set error state on fetch failure
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:3000/deliveryPartner/rejectingOrder`,
        null,
        { params: { orderId } }
      );
      // Update local state with the updated order status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      console.log(`Order ${orderId} rejected`);
    } catch (error) {
      setError(error.message); // Set error state on rejection failure
      console.error("Error rejecting order:", error);
    }
  };

  const handlePickupOrder = async (orderId) => {
    console.log(userName, "deliver id");
    try {
      await axios.patch(
        `http://localhost:3000/deliveryPartner/acceptOrder`,
        null,
        { params: { orderId, userName } }
      );

      // Update local state with the updated order status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Pickup" } : order
        )
      );
      console.log(`Order ${orderId} accepted`);
    } catch (error) {
      setError(error.message); // Set error state on acceptance failure
      console.log("error showinh");
      console.error("Error accepting order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pickup":
        return "bg-blue-500 text-white";
      case "Rejected":
      case "cancelled":
        return "bg-red-500 text-white";
      case "Accepted":
        return "bg-green-500 text-white";
      case "Pending":
      default:
        return "bg-yellow-500 text-gray-800";
    }
  };

  const renderActionButton = (order) => {
    switch (order.status) {
      case "Pending":
        return (
          <>
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700"
            >
              Reject
            </button>
            <button
              onClick={() => handlePickupOrder(order._id)}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
            >
              Accept
            </button>
          </>
        );
      case "cancelled":
        return (
          <>
            <span className="bg-red-500 text-white font-bold py-2 px-4 rounded-md">
              Rejected
            </span>
          </>
        );
      case "Accepted":
      case "Pickup": // Display both "Accepted" and "Pickup" when order status is Pickup
        return (
          <>
            <span className="bg-green-500 text-white font-bold py-2 px-4 rounded-md">
              Accepted
            </span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Deliverypartnerheader />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold"> Order List Page</h1>
          <p className="text-lg mt-4">
            Hi Welcome, {userRealName ? userRealName : "Delivery Partner"}!
          </p>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong> {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="relative rounded-lg overflow-hidden shadow-md p-4"
              style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
            >
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
              <p className="text-gray-600 mb-2 font-bold">
                Price: ₹{order.price}
              </p>
              <p className="text-gray-600 mb-2">Ordered by: {order.userName}</p>
              <div className="flex justify-between items-center mb-2">
                {renderActionButton(order)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
