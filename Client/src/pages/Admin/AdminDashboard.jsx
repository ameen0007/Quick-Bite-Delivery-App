import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Adminheader } from "../../components/Header/Adminheader";

export const AdminDashboard = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState("addFood");
  const [userDetails, setUserDetails] = useState([]);
  const [deliveryBoyDetails, setDeliveryBoyDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details
    axios
      .get("http://localhost:3000/admin/getUserData")
      .then((response) => {
        setUserDetails(response.data);
        console.log(response.data, "users");
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });

    // Fetch delivery boy details
    axios
      .get("http://localhost:3000/admin/getDeliveryPartnerData")
      .then((response) => {
        setDeliveryBoyDetails(response.data);
        console.log(response.data, "parteners");
      })
      .catch((error) => {
        console.error("Error fetching delivery boy details:", error);
      });
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview("");
    }
  };

  const handleCancelPhoto = () => {
    setPhoto(null);
    setPhotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFoodName("");
    setDescription("");
    setPrice("");
    setPhoto(null);
    setPhotoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("foodName", foodName);
    formData.append("description", description);
    formData.append("price", price);

    try {
      const response = await axios.post(
        "http://localhost:3000/admin/addFood",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      resetForm();
      toast.success("Food item added successfully!");
      console.log("Food item added:", response.data);
    } catch (error) {
      toast.error("Error adding food item!");
      console.error("Error adding food item:", error);
    }
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleNavigateUserActivity = (Id) => {
    navigate("/useractivity");
    localStorage.setItem("clickedUserid", Id);
  };

  const handleNavigateDeliveryPartnerActivity = (Id) => {
    navigate("/deliverypartneractivity");
    localStorage.setItem("clickedPartener", Id);
  };

  return (
    <>
      <Adminheader />
      <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="w-full max-w-4xl mb-8">
          <div className="flex justify-between">
            <button
              className={`px-4 py-2 rounded ${
                activeSection === "addFood"
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => toggleSection("addFood")}
            >
              Add Food Item
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeSection === "userDetails"
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => toggleSection("userDetails")}
            >
              User Details
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeSection === "deliveryBoyDetails"
                  ? "bg-black text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => toggleSection("deliveryBoyDetails")}
            >
              Delivery Boy Details
            </button>
          </div>
        </div>

        {activeSection === "addFood" && (
          <form
            className="bg-white shadow-black rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
            onSubmit={handleSubmit}
            style={{
              boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
              borderRadius: "7px",
            }}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="foodName"
              >
                Food Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="foodName"
                type="text"
                placeholder="Enter food name"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="description"
                placeholder="Enter food description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="price"
                type="number"
                placeholder="Enter food price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            {photoPreview && (
              <div className="relative mb-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleCancelPhoto}
                  className="absolute top-0 right-0 bg-white text-black border rounded-full p-1 font-bold text-lg hover:bg-black hover:text-white"
                  style={{
                    borderRadius: "70%",
                    transform: "translate(0%, -0%)",
                  }}
                >
                  <MdOutlineClear />
                </button>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="photo"
              >
                Photo
              </label>
              <input
                ref={fileInputRef}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                id="photo"
                type="file"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Food
              </button>
            </div>
          </form>
        )}

        {activeSection === "userDetails" && (
          <div className="bg-white shadow-black rounded px-8 pt-6 pb-8 mb-4 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Orders</th>
                  <th className="px-4 py-2">View Activity</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.map((user, index) => (
                  <tr key={index}>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {user.name}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {user.ordersCount}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      <p
                        onClick={() => handleNavigateUserActivity(user._id)}
                        className="flex justify-center text-center hover:text-green-600"
                      >
                        <FaEye />
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "deliveryBoyDetails" && (
          <div className="bg-white shadow-black rounded px-8 pt-6 pb-8 mb-4 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Delivery Boy Details</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Deliveries</th>
                  <th className="px-4 py-2">View Activity</th>
                </tr>
              </thead>
              <tbody>
                {deliveryBoyDetails.map((deliveryBoy, index) => (
                  <tr key={index}>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {deliveryBoy.name}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {deliveryBoy.email}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      {deliveryBoy.acceptedOrdersCount}
                    </td>
                    <td className="border-b-1 border-gray-500 text-center border px-4 py-2">
                      <p
                        onClick={() =>
                          handleNavigateDeliveryPartnerActivity(deliveryBoy._id)
                        }
                        className="flex justify-center text-center hover:text-green-600"
                      >
                        <FaEye />
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
