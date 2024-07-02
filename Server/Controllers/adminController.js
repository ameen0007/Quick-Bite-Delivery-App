const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel");
const DeliveryPartner = require("../models/deliveryPartnerModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Food = require("../models/foodModel");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET;
const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },

  region: bucketRegion,
});

exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin instance using the Admin model
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    // Save the new admin to the database
    const result = await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully", admin: result });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginAdmin = async (req, res) => {
  console.log("IAM HERE");
  const { email, password } = req.body;
  console.log(req.body, "bo");

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Handle successful login
    res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addFood = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const params = {
      Bucket: bucketName,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };
    const command = new PutObjectCommand(params);
    console.log("command:", command);

    await s3.send(command);
    const imageUrl = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${req.file.originalname}`;
    const { foodName, description, price } = req.body;

    const data = await Food.create({
      foodName,
      description,
      price,
      imageUrl: imageUrl,
    });
    console.log("dataaaa:", data);

    console.log("imageUrl:", imageUrl);
    res.status(200).json({ message: "inner suc" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error, "error");
  }
};

exports.getUserData = async (req, res) => {
  try {
    console.log("reached here");
    const userData = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          ordersCount: { $size: "$orders" }, //
        },
      },
    ]);
    console.log("userData:", userData);
    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDeliveryPartnerData = async (req, res) => {
  try {
    const deliveryPartnerData = await DeliveryPartner.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          acceptedOrdersCount: {
            $cond: {
              if: { $isArray: "$acceptedOrders" },
              then: { $size: "$acceptedOrders" },
              else: 0, // Handle cases where acceptedOrders is not an array
            },
          },
        },
      },
    ]);

    res.status(200).json(deliveryPartnerData);
  } catch (err) {
    console.error("Error fetching delivery partner data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.viewActivity = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userid from req.body

    console.log("userId:", userId);

    // Query orders for the specific user
    const userOrders = await Order.find({ userId: userId })
      .select("_id foodName imageUrl status price")
      .lean();

    console.log("userOrders:", userOrders);

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    const formattedOrders = userOrders.map((order) => ({
      orderId: order._id,
      foodName: order.foodName,
      imageUrl: order.imageUrl,
      status: order.status,
      price: order.price,
    }));

    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error("Error fetching user activity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.deliveryPartnerViewActivity = async (req, res) => {
  const { deliveryPartnerId } = req.query;
  console.log("deliveryPartnerId:", deliveryPartnerId);

  if (!deliveryPartnerId) {
    return res.status(400).json({ message: "Delivery Partner ID is required" });
  }

  try {
    // Use findById to find the delivery partner by its ID
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
      .populate("acceptedOrders.userId", "name") // Populate user details
      .populate("acceptedOrders.orderId", "status"); // Populate order details

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery Partner not found" });
    }

    const activity = deliveryPartner.acceptedOrders.map((order) => ({
      orderId: order.orderId._id,
      orderedPerson: order.userId.name,
      orderedFood: order.foodName,
      orderAcceptedDate: order.dateAccepted,
      orderStatus: order.orderId.status,
    }));
    console.log("activity:", activity);

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;
  console.log("orderId:", orderId);
  console.log("status:", newStatus);
  // Assuming orderId and newStatus are sent in the request body

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { status: newStatus },
      { new: true } // To return the updated document
    );

    console.log("updatedOrder:", updatedOrder);

    if (!updatedOrder) {
      console.log("not updating");
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder); // Send back the updated order object if needed
  } catch (error) {
    console.error("Failed to update order status", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
