import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export const DeliveryPartnerActivity = () => {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const deliveryPartnerId = localStorage.getItem("deliverypartner");
        const response = await axios.get(
          `http://localhost:3000/admin/deliveryPartnerViewActivity`,
          {
            params: { deliveryPartnerId },
          }
        );
        setOrders(response.data);
        console.log(response.data, "data");
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update the status locally
      setOrderStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: newStatus,
      }));

      // Send PATCH request to update status
      await axios.patch(`http://localhost:3000/admin/updateOrderStatus`, {
        orderId,
        newStatus,
      });

      // Update orders state immediately after successful status update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error(`Failed to update order ${orderId} status`, error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      case "Pickup":
        return "bg-blue-500 text-white";
      case "Pending":
      default:
        return "bg-yellow-500 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Delivery Partner Activities
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Ordered Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Order Food
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Pickup Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Change Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index} className="">
                <td className="border-b border-gray-700 px-6 py-4 whitespace-nowrap">
                  {order.orderedPerson}
                </td>
                <td className="border-b border-gray-700 px-6 py-4 whitespace-nowrap">
                  {order.orderedFood}
                </td>
                <td className="border-b border-gray-700 px-6 py-4 whitespace-nowrap">
                  {order.orderAcceptedDate}
                </td>
                <td className="border-b border-gray-700 px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${getStatusColor(
                      order.orderStatus
                    )} rounded-md`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="border-b border-gray-700 px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    <select
                      value={orderStatus[order.orderId] || order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <IoIosArrowDropdownCircle className="h-5 w-5" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
