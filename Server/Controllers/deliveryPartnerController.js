const Order = require("../models/orderModel");
const User = require("../models/userModel");
const DeliveryPartner = require("../models/deliveryPartnerModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwtHelper");

exports.signUp = async (req, res) => {
  console.log("reached here");
  const { name, email, password } = req.body;
  console.log("req.body:", req.body);

  try {
    let userType = "deliveryPartner";
    let deliveryPartner = await DeliveryPartner.findOne({ email });
    console.log("deliveryPartner:", deliveryPartner);
    if (deliveryPartner) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    deliveryPartner = new DeliveryPartner({
      name,
      email: email,
      password: hashedPassword,
    });
    await deliveryPartner.save();
    console.log("deliveryPartner:", deliveryPartner);

    generateToken(res, deliveryPartner, userType);
    res.status(201).json({
      message: "User registered successfully",
      uid: deliveryPartner._id,
      name: deliveryPartner.name,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password, userRole } = req.body;
  let userType = "deliveryPartner";
  console.log("userRole:", userRole);
  try {
    let deliveryPartner = await DeliveryPartner.findOne({ email });
    console.log("deliverypartnername:", deliveryPartner);
    if (!deliveryPartner) {
      return res.status(400).json({ message: "this email is not registered" });
    }
    const isMatch = await bcrypt.compare(password, deliveryPartner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(res, deliveryPartner, userType);
    res
      .status(201)
      .json({
        message: "Login Successfull",
        uid: deliveryPartner._id,
        name: deliveryPartner.name,
      });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getdeliveryData = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $nin: ["Delivered", "Cancelled"] },
    }).lean();

    const userIds = orders.map((order) => order.userId);

    const users = await User.find({ _id: { $in: userIds } }).lean();

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user.name;
    });

    const ordersWithUserDetails = orders.map((order) => ({
      ...order,
      userName: userMap[order.userId] || "Unknown User",
    }));
    console.log("ordersWithUserDetails:", ordersWithUserDetails);
    res.status(200).json({ orders: ordersWithUserDetails });
  } catch (error) {
    console.error("Error fetching delivery data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.rejectingOrder = async (req, res) => {
  const { orderId } = req.query; // Correctly retrieve orderId from query parameters

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order rejected", order });
  } catch (error) {
    console.error("Error rejecting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.acceptingOrder = async (req, res) => {
  const { orderId, userName } = req.query;
  console.log("orderId:", orderId);
  console.log("deliveryPartnerId:", userName);

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.status = "Pickup";
    await order.save();

    // Update delivery partner's accepted orders count
    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
      userName,
      { $inc: { acceptedOrdersCount: 1 } },
      { new: true } // Return the updated document
    );
    console.log("deliveryPartner:", deliveryPartner);

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // Optionally, store ordered food name and user details in delivery partner's collection
    deliveryPartner.acceptedOrders.push({
      foodName: order.foodName,
      userId: order.userId,
      orderId: order._id,
      dateAccepted: new Date(),
    });
    await deliveryPartner.save();

    res.status(200).json({ message: "Order accepted", order });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
