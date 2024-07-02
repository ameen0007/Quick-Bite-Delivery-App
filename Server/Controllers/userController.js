const Food = require("../models/foodModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwtHelper");

exports.getItems = async (req, res) => {
  try {
    const foodData = await Food.find();
    if (!foodData || foodData.length === 0) {
      return res.status(404).json({ message: "No food items found" });
    }
    // console.log(foodData, "fooddata");
    res.status(200).json(foodData);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.signUp = async (req, res) => {
  const { name, email, password, userRole } = req.body;
  console.log("req.body:", req.body);

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email: email,
      password: hashedPassword,
    });
    await user.save();

    generateToken(res, user, userRole);
    res.status(201).json({
      message: "User registered successfully",
      uid: user._id,
      name: user.name,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let userType = "user";

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "this email is not registered" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(res, user, userType);
    res
      .status(201)
      .json({ message: "Login Successfull", uid: user._id, name: user.name });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
exports.orders = async (req, res) => {
  const { userId, foodId } = req.body;

  try {
    const orderedFood = await Food.findById({ _id: foodId });
    if (!orderedFood) {
      return res.status(404).json({ message: "Food not found" });
    }

    // console.log("orderedFood:", orderedFood);

    const newOrder = new Order({
      userId: userId,
      foodName: orderedFood.foodName,
      price: orderedFood.price,
      imageUrl: orderedFood.imageUrl,
      status: "Pending",
      date: new Date(),
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrderedFoods = async (req, res) => {
  try {
    console.log("reached here");
    const { userId } = req.query;
    console.log(userId, "userid");
    const user = await User.findById(userId);
    if (!user) {
      console.log("erroe");
      return res.status(404).json({ message: "User not found" });
    }

    const userName = user.name; // Adjust the field name as per your User model
    const orderedFoods = await Order.find({ userId: userId });
    //   console.log(orderedFoods,"orderedFoods");
    if (orderedFoods.length === 0) {
      return res
        .status(404)
        .json({ message: `${userName}...You don't have any orders` });
    }

    res
      .status(200)
      .json({ message: "Orders fetched successfully", orders: orderedFoods });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { status } = req.body; // Retrieve status from request body
    const { orderId } = req.query; // Retrieve orderId from route parameters
    console.log("status:", status);
    console.log("orderId:", orderId);
    // Check if orderId is valid
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // Update the order status to 'Cancelled'
    order.status = status; // Assuming status is 'Cancelled'
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
