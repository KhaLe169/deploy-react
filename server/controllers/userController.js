const User = require('../models/user')
const Vendor = require('../models/vendor')
const Shipper = require('../models/shipper')
const Product = require('../models/product')
const Cart = require('../models/cart')
const FollowerList = require('../models/follower')
const Order = require('../models/order')
const Comment = require('../models/comment')
const HomepageBanner = require('../models/homepagebanner')
const Thread = require('../models/thread')
const Message = require('../models/message')
const Report = require('../models/report')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Mailgen = require('mailgen')
const nodemailer = require('nodemailer')
const algoliasearch = require('algoliasearch')
const ImageKit = require("imagekit")
// Connect and authenticate with your Algolia app
const client = algoliasearch('DN0WBRQ8A3', '97b9021b42c870239d32f46da97d83cb')
const index = client.initIndex('rBuy')
const { OpenAI } = require('openai')
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function authenticateToken(token) {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
          resolve(null);
        } else {
          resolve(user.user);
        }
      });
    } catch (error) {
      return null;
    }
  });
}

const imagekit = new ImageKit({
  publicKey: "public_/qnMdn3Z1wjuZZM9H8sVN6bwzIQ=",
  privateKey: "private_cbWm9zohUJFQN1mBMEOxC6ZNjrY=",
  urlEndpoint: "https://ik.imagekit.io/cnhlinh"
});

const fs = require("fs");
const { error } = require('console')
require('dotenv').config()

function convertUser(user) {
  if (!user) return null;
  const userJson = user.toJSON();
  if (user.img && user.img.data) {
    userJson.img = Buffer.from(user.img.data).toString("base64");
  }
  return userJson;
}

function sendEmailVerification(userEmail) {
  try {
    let config = {
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS
      }
    }

    let transporter = nodemailer.createTransport(config);

    let mailgenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js"
      }
    })
    const userToken = jwt.sign({ user: userEmail }, process.env.VERIFY_EMAIL, { expiresIn: '10m' });
    const url = `http://localhost:3000/user/${userToken}/verify-email`;

    let response = {
      body: {
        intro: "Email verification",
        outro: `Please lick on this link to verify your email ${url}, This link will be expired in 10 minutes`,
      }
    }

    let mail = mailgenerator.generate(response);

    let message = {
      from: "rBuy@gmail.com",
      to: userEmail,
      subject: "Email verification",
      html: mail
    }
    transporter.sendMail(message)
  }
  catch {
    console.log("error when send Email")
  }
}
function sendVendorReportNotificationEmail(userEmail, title, description) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw "Invalid email";
    }


    let config = {
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS
      }
    }

    let transporter = nodemailer.createTransport(config);

    let mailgenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js"
      }
    })

    let response = {
      body: {
        intro: "Regarding your online shop,",
        outro: ["We have recently received a report about your store. See the detail below. We will take a look into the situation. Please be reminded that your account might be banned if your activity violated the rBUY's policies.",
          "Report details:",
          `Title: ${title}`,
          `Description: ${description}`]
      }
    }

    let mail = mailgenerator.generate(response);

    let message = {
      from: "rBuy@gmail.com",
      to: userEmail,
      subject: "Report Update from rBUY",
      html: mail
    }
    transporter.sendMail(message)
  }
  catch (error) {
    console.error(error)
  }
}
function sendProductReportNotificationEmail(userEmail, productName, title, description) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      throw "Invalid email";
    }

    let config = {
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASS
      }
    }

    let transporter = nodemailer.createTransport(config);

    let mailgenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js"
      }
    })

    let response = {
      body: {
        intro: `Regarding your product: ${productName},`,
        outro: ["We have recently received a report about your product. See the detail below. We will take a look into the situation. Please be reminded that your account might be banned if your activity violated the rBUY's policies.",
          "Report details:",
          `Title: ${title}`,
          `Description: ${description}`]
      }
    }

    let mail = mailgenerator.generate(response);

    let message = {
      from: "rBuy@gmail.com",
      to: userEmail,
      subject: "Report Update from rBUY",
      html: mail
    }
    transporter.sendMail(message)
  }
  catch (error) {
    console.error(error)
  }
}

exports.loginSuccess = async (req, res) => {
  let user = await authenticateToken(req.cookies.userToken);
  if (user) {
    user = convertUser((await User.findById(user._id)) || (await Vendor.findById(user._id)) || (await Shipper.findById(user._id)));
    const cart = await Cart.findOne({ userID: user._id })
    res.status(200).json({ user: user, cart: (cart) ? cart : null });
  } else {
    res.status(500).json({ user: "", cart: null })
  }
}

exports.homePage = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let product;
    if (page > 1) {
      product = await Product.find({}).limit(30 + 30 * page);
      product = product.slice(-30);
    } else {
      product = await Product.find({}).limit(30);
    }
    return res.json({ product: product });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.slider = async (req, res) => {
  try {
    const banner = await HomepageBanner.findOne({ title: 'Big Carousel' })
    const carouselImage = banner.img;
    return res.json({ images: carouselImage });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.middleBanner = async (req, res) => {
  try {
    const banner = await HomepageBanner.findOne({ title: 'Small Carousel' })
    const carouselImage = banner.img;
    return res.json({ images: carouselImage });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.chatbotMessage = async (req, res) => {
  let threadId = req.cookies.threadId;
  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
    res.cookie("threadId", threadId, { httpOnly: true, sameSite: 'none', secure: true }); // pass thread id into the cookies
  }
  let messages;
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: req.body.message
  });
  const run = await openai.beta.threads.runs.create(threadId, { assistant_id: process.env.ASSISTANT_ID });
  while (true) {
    const runRetreive = await openai.beta.threads.runs.retrieve(threadId, run.id);
    if (runRetreive.status === "completed") {
      messages = await openai.beta.threads.messages.list(threadId);
      break;
    }
  }
  return res.json({ message: messages.data[0].content[0].text.value });
}

exports.productPage = async (req, res) => {
  try {
    let product = await Product.findById(new mongoose.Types.ObjectId(new mongoose.Types.ObjectId(req.params.id)));
    let vendorName = await Vendor.findById(product.owner, { businessName: 1 })
    const numberOfFollowers = await FollowerList.findOne({ vendorID: product.owner }, { followers: 1 })
    return res.json({ product: product, vendorName: vendorName.businessName, numberOfFollowers: numberOfFollowers ? numberOfFollowers.followers.length : 0 });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: "Error Occured" });
  }
}

exports.registerpage = (req, res) => {
  try {
    res.render('register', { title: 'rBUY - Register' });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.userRegister = async (req, res) => {
  const bcrypt = require('bcrypt');
  try {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const checkEmail =
      (await User.findOne({ email: email })) ||
      (await Vendor.findOne({ email: email })) ||
      (await Shipper.findOne({ email: email }));

    const checkPhone =
      (await User.findOne({ phoneNumber: phoneNumber })) ||
      (await Vendor.findOne({ phoneNumber: phoneNumber }));

    if (checkEmail) {
      return res.status(500).json("Email already exists.")
    } else if (checkPhone) {
      return res.status(500).json("Phone number already exists.")
    } else {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        name: req.body.name,
        address: req.body.address,
        phoneNumber: phoneNumber,
      });
      await newUser.save();
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address");
      }
      sendEmailVerification(email)
      return res.status(200).json("Thank you for registering! A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don't see the email, please check your spam folder.");
    }
  } catch (error) {
    res.status(500).send(error.message || "Error Occured");
  }
}

exports.vendorRegister = async (req, res) => {
  const bcrypt = require('bcrypt');
  try {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const businessName = req.body.businessName;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const checkEmail =
      (await User.findOne({ email: email })) ||
      (await Vendor.findOne({ email: email })) ||
      (await Shipper.findOne({ email: email }));

    const checkPhone =
      (await User.findOne({ phoneNumber: phoneNumber })) ||
      (await Vendor.findOne({ phoneNumber: phoneNumber })) ||
      (await Shipper.findOne({ phoneNumber: phoneNumber }));

    const checkBusinessName = (await Vendor.findOne({ businessName: businessName }));

    if (checkEmail) {
      return res.status(500).json("Email already exists.");
    } else if (checkPhone) {
      return res.status(500).json("Phone number already exists.")
    } else if (checkBusinessName) {
      return res.status(500).json("Business name already exists.")
    } else {
      const newVendor = new Vendor({
        email: email,
        password: hashedPassword,
        businessName: businessName,
        address: req.body.address,
        phoneNumber: phoneNumber,
      });
      await newVendor.save();
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address");
      }
      sendEmailVerification(email)
      return res.status(200).json("Thank you for registering! A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don't see the email, please check your spam folder.");
    }
  } catch (error) {
    res.status(500).send(error.message || "Error Occured");
  }
}

exports.shipperRegister = async (req, res) => {
  const bcrypt = require('bcrypt');
  try {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const distributionHub = req.body.distributionHub

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const checkEmail =
      (await User.findOne({ email: email })) ||
      (await Vendor.findOne({ email: email })) ||
      (await Vendor.findOne({ email: email }));


    const checkPhone =
      (await User.findOne({ phoneNumber: phoneNumber })) ||
      (await Vendor.findOne({ phoneNumber: phoneNumber })) ||
      (await Shipper.findOne({ phoneNumber: phoneNumber }));

    if (checkEmail) {
      return res.status(500).json("Email already exists.")
    } else if (checkPhone) {
      return res.status(500).json("Phone number already exists.")
    } else {
      const newShipper = new Shipper({
        email: email,
        password: hashedPassword,
        name: req.body.name,
        address: req.body.address,
        phoneNumber: phoneNumber,
        distributionHub: distributionHub,
      });
      await newShipper.save();
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email address");
      }
      sendEmailVerification(email)
      return res.status(200).json("Thank you for registering! A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don't see the email, please check your spam folder.");
    }
  } catch (error) {
    res.status(500).send(error.message || "Error Occured");
  }
}

exports.forgotPassword = async (req, res) => {
  let userEmail = req.body.email

  let config = {
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASS
    }
  }

  let transporter = nodemailer.createTransport(config);

  let mailgenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js"
    }
  })

  const userToken = jwt.sign({ user: userEmail }, process.env.RESETPWD, { expiresIn: '10m' });
  const url = `http://localhost:3000/user/${userToken}/forgot-password`;

  let response = {
    body: {
      intro: "Forgot password verification link",
      outro: `Please lick on this link to reset your password ${url}, This link will be expired in 10 minutes`,
    }
  }

  let mail = mailgenerator.generate(response);

  let message = {
    from: "rBuy@gmail.com",
    to: userEmail,
    subject: "Forgot password verification",
    html: mail
  }

  transporter.sendMail(message).then(() => {
    return res.status(201).json({ msg: "Email sent" })
  }).catch(er => {
    return res.status(500).json({ er: er })
  })
}

exports.loginPage = (req, res) => {
  try {
    res.json("This is login Page");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.resetPassword = (req, res) => {
  jwt.verify(req.params.token, process.env.RESETPWD, (err, user) => {
    if (err) return res.json()
    res.json({ userEmail: user })
  })
}

exports.postResetPassword = async (req, res) => {
  const { userEmail, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email: userEmail }, { password: hashedPassword, verify: true });
  return res.json({ msg: "Password updated successfully. You will be directed to login page in 5 seconds" });
}

exports.verifyEmail = async (req, res) => {
  jwt.verify(req.params.token, process.env.VERIFY_EMAIL, async (err, user) => {
    if (err) return res.status(500).json("error");
    const foundUser = (await User.findOneAndUpdate({ email: user.user }, { verify: true })) || (await Vendor.findOneAndUpdate({ email: user.user }, { verify: true })) || (await Shipper.findOneAndUpdate({ email: user.user }, { verify: true }))
    if (!foundUser) return res.status.json("error");
    return res.status(200).json("success")
  })
}

exports.postVerifyEmail = async (req, res) => {
  try {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = req.body.email;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }
    sendEmailVerification(email)
    return res.status(200).json({ msg: "A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account. If you don't see the email, please check your spam folder." });
  } catch (error) {
    res.status(500).send(error.message || "Error Occured");
  }
}

// Place the Order
exports.placeOrder = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    let userID = user._id;
    user = await User.findById(user._id, { name: 1 });

    if (req.body.checkoutInfo.isRemember) {
      await User.findByIdAndUpdate(userID, { city: req.body.checkoutInfo.city, phoneNumber: req.body.checkoutInfo.phoneNumber, district: req.body.checkoutInfo.district, ward: req.body.checkoutInfo.ward, streetAddress: req.body.checkoutInfo.streetAddress })
    }
    const products = req.body.products

    // Find the user's cart
    const userCart = await Cart.findOne({ userID }).populate('products.product');
    if (!userCart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Group products by owner
    const productsByOwner = userCart.products.reduce((groups, cartItem) => {
      const ownerID = cartItem.product.owner.toString();
      if (!groups[ownerID]) {
        groups[ownerID] = [];
      }
      groups[ownerID].push(cartItem);
      return groups;
    }, {});

    // Create an order for each owner
    for (const ownerID in productsByOwner) {
      const order = new Order({
        userId: userID,
        vendorID: ownerID,
        products: productsByOwner[ownerID].map((cartItem) => ({
          productId: cartItem.product._id,
          quantity: cartItem.quantity,
          image_link: cartItem.product.image_link,
          price: cartItem.product.price,
          product_name: cartItem.product.product_name
        })),
        userName: user.name,
        shippingAddress: req.body.checkoutInfo.streetAddress,
        contactNumber: req.body.checkoutInfo.phoneNumber,
        shippingFee: req.body.shippingFee,
        city: req.body.checkoutInfo.city,
        ward: req.body.checkoutInfo.ward,
        district: req.body.checkoutInfo.district,
      });
      await order.save();
    }
    for (const product of products) {
      await userCart.removeProduct(product.product); // Remove each product from the cart
    }
    res.status(200).json({ message: 'Orders placed successfully!', cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error placing order' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    if (!user) {
      return res.status(500).json({ error: "Please log in or create an account to add items to your cart." })
    }
    const cart = await Cart.findOne({ userID: user._id })

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).json({ error: "Cannot find the product." })
    }

    if (!cart) {
      const newCart = new Cart({
        userID: new mongoose.Types.ObjectId(user._id),
        products: [{
          product: product._id,
          quantity: (req.query.quantity) ? req.query.quantity : 1,
          owner: new mongoose.Types.ObjectId(product.owner),
          image_link: product.image_link,
          price: product.price,
          product_name: product.product_name,
        }]
      })
      await newCart.save()
    } else {
      await cart.addProduct(
        await Product.findById(req.params.id),
        (req.query.quantity) ? req.query.quantity : 1
      );
    }
    return res.status(200).json({ msg: "added to cart", cart: (cart) ? cart : null })
  } catch {
    return res.status(500).json({ error: "Please log in or create an account to add items to your cart." })
  }
}

exports.viewInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    return res.status(200).json({ order: order });
  } catch (error) {
    return res.status(500).json({ error: "Cannot find order" });
  }

}

exports.removeProduct = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const cart = await Cart.findOne({ userID: user._id })
    const product = await Product.findById(req.params.id);
    cart.removeProduct(product._id);
    return res.status(200).json({ cart: cart })
  }
  catch {
    return res.status(500).json({ error: "Cannot find the product." })
  }
}

exports.removeAllProducts = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const cart = await Cart.findOne({ userID: user._id });
    req.body.productIds.forEach(productId => {
      cart.products = cart.products.filter(p => p.product._id.toString() !== productId.toString());
    });
    await cart.save();
    return res.status(200).json({ cart: cart });
  } catch {
    return res.status(500).json({ error: "Cannot find the products." });
  }
}

exports.manageOrder = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const orders = await Order.find({ vendorID: user._id })
    return res.status(200).json((orders) ? { orders: orders } : { orders: "" });
  } catch {
    return res.status(500).json({ error: "Cannot find order. " })
  }
}

exports.vendorHomepage = async (req, res) => {
  try {
    const vendor = convertUser(await Vendor.findById(req.params.id, { businessName: 1, address: 1, phoneNumber: 1, email: 1, description: 1, img: 1, coverPhoto: 1, bigBanner: 1, smallBanner1: 1, smallBanner2: 1 }));
    const numberOfProducts = await Product.find({ owner: req.params.id }).countDocuments();
    const numberOfFollowers = await FollowerList.findOne({ vendorID: req.params.id }, { followers: 1 })
    const trendingProducts = await Product.find({ owner: req.params.id })
      .sort({ ratings: -1, no_of_ratings: -1 }) // sort in descending order based on salesCount
      .limit(5) // limit the result to 5
      .exec();
    return res.status(200).json({ vendor: vendor, numberOfProducts: numberOfProducts, numberOfFollowers: numberOfFollowers ? numberOfFollowers.followers.length : 0, trendingProducts: trendingProducts });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Vendor not found" })
  }
}

exports.vendorProductPage = async (req, res) => {
  try {
    const vendor = convertUser(await Vendor.findById(req.params.id, { businessName: 1, address: 1, phoneNumber: 1, email: 1, description: 1, img: 1, coverPhoto: 1, bigBanner: 1, smallBanner1: 1, smallBanner2: 1 }));
    const numberOfProducts = await Product.find({ owner: req.params.id }).countDocuments();
    const numberOfFollowers = await FollowerList.findOne({ vendorID: req.params.id }, { followers: 1 })
    return res.status(200).json({ vendor: vendor, numberOfProducts: numberOfProducts, numberOfFollowers: numberOfFollowers ? numberOfFollowers.followers.length : 0 });
  } catch (error) {
    return res.status(500).json({ error: "Vendor not found" })
  }
}

exports.confirmOrder = async (req, res) => {
  try {

    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);

    const statuses = ["Unpaid", "To Ship", "Shipping", "Completed"];
    const currentIndex = statuses.indexOf(order.status);

    if (currentIndex === statuses.length - 1) {
      return res.status(500).json({ msg: "Cannot update status" });
    }

    const nextStatus = statuses[currentIndex + 1];
    await Order.findByIdAndUpdate(orderId, { status: nextStatus });

    return res.status(200).json({ msg: "Order confirmed" });
  } catch (error) {
    return res.status(500).json({ error: "Can not found order" });
  }
}

exports.getVendorDashboard = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const ordersStatus = await Order.aggregate([
      {
        $match: { vendorID: new mongoose.Types.ObjectId(user._id) }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    const orders = await Order.find({ vendorID: user._id, status: "Completed" });
    const numberOfFollowers = await FollowerList.findOne({ vendorID: user._id }, { followers: 1 })
    const numberOfProducts = await Product.find({ owner: user._id }).countDocuments();
    const ordersCountByStatus = {};
    ordersStatus.forEach(orderGroup => {
      ordersCountByStatus[orderGroup._id] = orderGroup.count;
    });
    const income = orders.reduce((total, order) => total + order.products.reduce((total, product) => total + product.price * product.quantity, 0), 0);
    res.status(200).json({ ordersByStatus: ordersCountByStatus, orders: orders, numberOfFollowers: numberOfFollowers ? numberOfFollowers.followers.length : 0, income: income, numberOfProducts: numberOfProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.cartPage = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const cart = await Cart.find({ userID: user._id })
    const products = cart[0].products
    return res.status(200).json({ products: products })
  } catch {
    return res.status(500).json({ error: "Cannot find cart" })
  }
}

exports.checkout = async (req, res) => {
  let user = await authenticateToken(req.cookies.userToken);
  if (!user) {
    return res.status(500).json({ error: "You need to login first" })
  }
  user = await User.findById(user._id, { phoneNumber: 1, city: 1, district: 1, ward: 1, streetAddress: 1 })
  const checkoutInfo = {
    phoneNumber: user.phoneNumber,
    city: user.city,
    district: user.district,
    ward: user.ward,
    streetAddress: user.streetAddress,
  }
  return res.status(200).json({ checkoutInfo: checkoutInfo })
}

exports.logout = (req, res) => {
  try {
    res.clearCookie("userToken");
    return res.json('Logged out successfully');
  } catch {
    console.log(error)
    return res.status(500).json({ error: "Cannot logout" })
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (req.file) {
      const image = {
        data: fs.readFileSync("uploads/" + req.file.filename),
      };
      user.img = image;
    }
    if (req.body.name) {
      user.name = req.body.name
    }
    if (req.body.address) {
      user.address = req.body.address
    }
    if (req.body.phoneNumber) {
      const phoneNumber = req.body.phoneNumber;
      const checkPhone =
        (await User.findOne({ phoneNumber: phoneNumber })) ||
        (await Vendor.findOne({ phoneNumber: phoneNumber })) ||
        (await Shipper.findOne({ phoneNumber: phoneNumber }));
      if (checkPhone) {
        return res.status(500).json("Phone number already exists.")
      } else {
        user.phoneNumber = phoneNumber;
      }
    }
    await user.save();
    return res.json('Profile has been updated!')
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.updateVendor = async (req, res) => {
  try {
    let vendor = await authenticateToken(req.cookies.userToken);
    vendor = await Vendor.findById(vendor._id, { img: 1, address: 1, phoneNumber: 1 });
    if (req.file) {
      const image = {
        data: fs.readFileSync("uploads/" + req.file.filename),
      };
      vendor.img = image;
    }

    if (req.body.address) { vendor.address = req.body.address; }
    if (req.body.phoneNumber) {
      const phoneNumber = req.body.phoneNumber;
      const checkPhone =
        (await User.findOne({ phoneNumber: phoneNumber })) ||
        (await Vendor.findOne({ phoneNumber: phoneNumber })) ||
        (await Shipper.findOne({ phoneNumber: phoneNumber }));
      if (checkPhone) {
        return res.json("Phone number has already existed.");
      } else { vendor.phoneNumber = req.body.phoneNumber; }
    }
    await vendor.save();
    return res.json('Profile has been updated!')
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.updateShipper = async (req, res) => {
  try {
    const shipper = await Shipper.findOne({ email: req.body.email });
    if (req.file) {
      const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      shipper.img = image;
    }
    if (req.body.name) {
      shipper.name = req.body.name;
    }
    if (req.body.address) {
      shipper.address = req.body.address;
    }
    if (req.body.phoneNumber) {
      const phoneNumber = req.body.phoneNumber;
      const checkPhone =
        (await User.findOne({ phoneNumber: phoneNumber })) ||
        (await Vendor.findOne({ phoneNumber: phoneNumber })) ||
        (await Shipper.findOne({ phoneNumber: phoneNumber }));
      if (checkPhone) {
        shipper.phoneNumber = req.body.phoneNumber;
      }
    }
    await shipper.save();
    return res.json('Profile has been updated!')
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.banUser = async (req, res) => {
  const userId = req.body.userId;
  if (req.body.remove) {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ msg: "Remove user successfully" });
  }
  const startDate = (req.body.startDate).split('T')[0];
  const endDate = (req.body.endDate).split('T')[0];

  try {
    const user = await User.findById(userId);
    const vendor = await Vendor.findById(userId);
    const shipper = await Shipper.findById(userId);

    if (user) {
      await User.updateOne({ _id: userId }, { banEndDate: endDate, banStartDate: startDate });
    } else if (vendor) {
      await Vendor.updateOne({ _id: userId }, { banEndDate: endDate, banStartDate: startDate });
    } else if (shipper) {
      await Shipper.updateOne({ _id: userId }, { banEndDate: endDate, banStartDate: startDate });
    } else {
      throw new Error('User does not exist!');
    }

    return res.status(200).json({ msg: "Banned user successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

exports.userProfile = async (req, res) => {
  return res.status(200).json("profile page");
}

exports.editStore = async (req, res) => {
  try {
    let vendor = await authenticateToken(req.cookies.userToken);
    vendor = await Vendor.findById(vendor._id, { coverPhoto: 1, bigBanner: 1, smallBanner1: 1, smallBanner2: 1 });
    const uploadImage = async (file) => {
      try {
        const response = await imagekit.upload({
          file: fs.readFileSync("uploads/" + file[0].filename),
          fileName: file.filename + ".jpg",
        });
        return response.url;
      } catch (err) {
        console.log("Error uploading image:", err);
        return null;
      }
    };

    if (req.files) {
      if (req.files.coverPhoto) {
        vendor.coverPhoto = await uploadImage(req.files.coverPhoto);
      }

      if (req.files.bigBanner) {
        vendor.bigBanner = await uploadImage(req.files.bigBanner);
      }

      if (req.files.smallBanner1 && req.files.smallBanner2) {
        vendor.smallBanner1 = await uploadImage(req.files.smallBanner1);
        vendor.smallBanner2 = await uploadImage(req.files.smallBanner2);
      }

      if ((req.files.smallBanner1 && !req.files.smallBanner2) || (!req.files.smallBanner1 && req.files.smallBanner2)) {
        return res.json("Must include 2 images file for 2 small banner.")
      }

    }
    await vendor.save();
    return res.json('Storefront has been updated!')
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.getStoreInfo = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const numberOfProducts = await Product.find({ owner: user._id }).countDocuments();
    const numberOfFollowers = await FollowerList.find({ vendorID: user._id }, { followers: 1 });
    return res.status(200).json({ numberOfProducts: numberOfProducts, numberOfFollowers: numberOfFollowers ? numberOfFollowers.followers.length : 0 });
  } catch {
    return res.status(500).json({ error: "Cannot find store info" })
  }
}

exports.addNewProduct = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const id = new mongoose.Types.ObjectId();
    const uploadImage = async () => {
      try {
        if (req.file) {
          const response = await imagekit.upload({
            file: fs.readFileSync("uploads/" + req.file.filename),
            fileName: id + ".jpg",
          });
          return response.url;
        } else {
          return null;
        }
      } catch (err) {
        console.log("Error uploading image:", err);
        return null;
      }
    };

    const imageURL = await uploadImage();

    const newProduct = new Product({
      _id: id,
      owner: user._id,
      product_name: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      stock: req.body.stock,
      image_link: imageURL,
      no_of_ratings: 0,
      ratings: 0.0,
    });

    await newProduct.save()
      .then(() => { })
      .catch(err => console.log(err));

    const object = {
      objectID: id,
      product_name: req.body.productName,
      category: req.body.category,
      owner: req.user.businessName,
      price: parseInt(req.body.price, 10),
      description: req.body.description,
      stock: req.body.stock,
      image_link: imageURL,
      no_of_ratings: 0,
      ratings: 0.0,
    };

    index.saveObject(object).wait()
      .then(() => { })
      .catch(err => console.log(err));
    return res.json("Product has been uploaded.")
  } catch (error) {
    res.status(500).json({ message: error.message || "Error Occured" });
  }
};

// Function to delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const productToDelete = await Product.findById(productID);
    if (!productToDelete) {
      return res.status(404).json('Product not found');
    }
    await Product.findByIdAndDelete(productID);
    index.deleteObject(productID)
      .then(() => { })
      .catch(err => res.json(err));
    return res.status(200).json('Product deleted successfully');
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const productToUpdate = await Product.findById(productID);

    let object = { objectID: productID };
    if (req.file) {
      const image = {
        data: fs.readFileSync("uploads/" + req.file.filename),
      };
      productToUpdate.img = image;

      const uploadImage = async () => {
        try {
          const response = await imagekit.upload({
            file: fs.readFileSync("uploads/" + req.file.filename),
            fileName: productID + ".jpg",
          });
          console.log(response.url);
          return response.url;
        } catch (err) {
          console.log("Error uploading image:", err);
          return null;
        }
      };
      const imageURL = await uploadImage();
      index.partialUpdateObject({
        image_link: imageURL,
        objectID: productID
      }).then(({ objectID }) => {
        console.log(objectID);
      });
    }
    if (req.body.productName) {
      productToUpdate.product_name = req.body.productName;
      object.product_name = req.body.productName;
    }
    if (req.body.price) {
      productToUpdate.price = req.body.price;
      object.price = parseInt(req.body.price, 10);
    }
    if (req.body.category) {
      productToUpdate.category = req.body.category;
      object.category = req.body.category;
    }
    if (req.body.description) {
      productToUpdate.description = req.body.description;
      object.description = req.body.description;
    }
    if (req.body.stock) {
      productToUpdate.stock = req.body.stock;
      object.stock = req.body.stock;
    }
    await productToUpdate.save();
    index.partialUpdateObject(object).then(() => { });
    return res.json('Product has been updated!')
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}

exports.manageProduct = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const { product_name, category } = req.query; // extract product_name and category from query parameters

    // build the query object
    let query = { owner: user._id };

    if (product_name) {
      query.product_name = new RegExp(product_name, 'i');
    }
    if (category) {
      query.category = new RegExp(category, 'i');
    }

    const products = await Product.find(query);

    return res.status(200).json((products) ? { products: products } : { products: "" });
  } catch {
    return res.status(500).json({ error: "Cannot find products." })
  }
}

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ product: product });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
}


exports.manageUser = async (req, res) => {
  try {
    const users = (await User.find({})).filter(user => user.role !== "Admin").map(user => convertUser(user));
    const vendors = (await Vendor.find({})).map(vendor => convertUser(vendor));
    const shippers = (await Shipper.find({})).map(shipper => convertUser(shipper));

    const reportCounts = await Report.aggregate([
      {
        $group: {
          _id: "$vendor",
          count: { $sum: 1 }
        }
      }
    ]);

    const reportCountsByVendor = {};
    reportCounts.forEach(reportGroup => {
      reportCountsByVendor[reportGroup._id.toString()] = reportGroup.count;
    });

    vendors.forEach(vendor => {
      vendor.reportCount = reportCountsByVendor[vendor._id.toString()] || 0;
    });

    vendors.sort((a, b) => b.reportCount - a.reportCount);

    return res.status(200).json({ users: users, vendors: vendors, shippers: shippers });
  } catch (error) {
    return res.status(500).json({ error: "Cannot find user. " })
  }
}

exports.reportPage = async (req, res) => {
  try {
    const user = convertUser(await User.findById(req.params.id));
    const vendor = convertUser(await Vendor.findById(req.params.id));
    const shipper = convertUser(await Shipper.findById(req.params.id));

    if (user) {
      const orders = await Order.find({ userId: user._id })
      return res.status(200).json({ user: user, orders: orders });
    }

    if (vendor) {
      const orders = await Order.find({ vendorID: vendor._id })
      const reports = await Report.find({ vendor: vendor._id });
      const reportsInfo = await Promise.all(reports.map(async (report) => {
        const reportJson = report.toJSON();
        reportJson.user = convertUser(await User.findById(report.user));
        return reportJson;
      }));
      return res.status(200).json({ user: vendor, orders: orders, report: reportsInfo });
    };

    if (shipper) {
      const orders = await Order.find({ status: { $ne: "Unpaid" } });
      return res.status(200).json({ user: shipper, orders: orders });
    }
    if (!user && !vendor && !shipper) throw new Error("User not found");
  } catch (er) {
    return res.status(500).json({ error: er })
  }
}

exports.uploadHomepageCarousel = async (req, res) => {
  try {
    let banner = await HomepageBanner.findOne({ title: req.body.title })
    if (!banner) {
      banner = new HomepageBanner({
        title: req.body.title,
      })
    }
    const uploadImage = async (file) => {
      try {
        const response = await imagekit.upload({
          file: fs.readFileSync("uploads/" + file.filename),
          fileName: file.filename + ".jpg",
        });
        return response.url;
      } catch (err) {
        console.log("Error uploading image:", err);
        return null;
      }
    };
    if (req.files) {
      const images = await Promise.all(req.files.map(async (file) => await uploadImage(file)));
      banner.img = images.filter(url => url !== null);
    }
    await banner.save();
    return res.status(200).json("Image uploaded.")
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error })
  }
}

exports.getThreads = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const threads = await Thread.find({ $or: [{ userId: user._id }, { vendorId: user._id }] }).populate('content');
    let users = [];
    for (const thread of threads) {
      let chatUser = convertUser((user.role === "User") ? await Vendor.findById(thread.vendorId, { businessName: 1, img: 1 }) : await User.findById(thread.userId, { name: 1, img: 1 }));
      users.push(chatUser);
    }
    return res.status(200).json({ threads: threads, users: users });
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

exports.addMessage = async (req, res) => {
  try {
    const threadId = new mongoose.Types.ObjectId(req.params.id);
    let user = await authenticateToken(req.cookies.userToken);
    const thread = await Thread.findById(threadId);
    if (!thread) return res.status(500).json({ error: "Thread not found" });

    const message = new Message({
      content: req.body.content,
      sender: (user.role === "User") ? "User" : "Vendor",
    })

    await message.save();
    thread.addMessage(message);
    return res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error })
  }
}

exports.createThread = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    user = await User.findById(user._id, { role: 1, img: 1 });
    const userId = user._id;
    const role = user.role;
    const otherUserId = role === "User" ? req.body.vendorId : req.body.userId;

    let thread = await Thread.findOne({ $or: [{ userId, vendorId: otherUserId }, { vendorId: userId, userId: otherUserId }] }).populate('content');

    if (!thread) {
      const newThreadData = role === "User" ? { userId, vendorId: otherUserId } : { userId: otherUserId, vendorId: userId };
      thread = await Thread.create(newThreadData);
    }

    return res.status(200).json({ thread: thread });
  } catch (error) {
    return res.status(500).json({ error: "You must login first!" });
  }
}

exports.getAdminDashboard = async (req, res) => {
  try {
    const numberOfUsers = await User.countDocuments({ role: { $ne: 'Admin' } });
    const numberOfVendors = await Vendor.countDocuments();
    const numberOfShippers = await Shipper.countDocuments();
    const numberOfProducts = await Product.countDocuments();
    return res.status(200).json({ numberOfUsers: numberOfUsers, numberOfVendors: numberOfVendors, numberOfShippers: numberOfShippers, numberOfProducts: numberOfProducts });
  } catch (error) { }
  return res.status(500).json({ error: error })
}

exports.userOrder = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    let orders = await Order.find({ userId: user._id });
    let vendorIds = [...new Set(orders.map(order => order.vendorID))];
    let vendors = await Vendor.find({ _id: { $in: vendorIds } }, { businessName: 1 });
    let vendorNameMap = {};
    vendors.forEach(vendor => {
      vendorNameMap[vendor._id.toString()] = vendor.businessName;
    });
    orders = orders.map(order => {
      let jsonOrder = order.toJSON();
      jsonOrder.vendorName = vendorNameMap[order.vendorID.toString()];
      return jsonOrder;
    });
    orders.reverse();
    return res.status(200).json((orders) ? { orders: orders } : { orders: "" });
  } catch (error) {
    return res.status(500).json({ error: "Cannot find order. " })
  }
}

exports.getShipperDashboard = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "Unpaid" } }).populate({
      path: 'vendorID',
      select: 'address businessName -_id'
    });

    const ordersCount = await Order.aggregate([
      {
        $match: { status: { $ne: "Unpaid" } }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const ordersCountByStatus = {};
    ordersCount.forEach(orderGroup => {
      ordersCountByStatus[orderGroup._id] = orderGroup.count;
    });
    return res.status(200).json({ orders: orders, ordersCountByStatus: ordersCountByStatus });
  }
  catch (error) {
    return res.status(500).json({ error: "Cannot find order. " })
  }
}

exports.reportVendor = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const vendorEmail = (await Vendor.findById(req.body.vendorID)).email;
    const newReport = new Report({
      user: user._id,
      vendor: req.body.vendorID,
      title: req.body.title,
      description: req.body.description,
      date: Date.now(),
    })
    const uploadImage = async (file) => {
      try {
        const response = await imagekit.upload({
          file: fs.readFileSync("uploads/" + file.filename),
          fileName: file.filename + ".jpg",
        });
        return response.url;
      } catch (err) {
        console.log("Error uploading image:", err);
        return null;
      }
    };
    if (req.files) {
      const images = await Promise.all(req.files.map(async (file) => await uploadImage(file)));
      newReport.evidence = images.filter(url => url !== null)
    }
    await newReport.save();
    sendVendorReportNotificationEmail(vendorEmail, req.body.title, req.body.description)
    return res.status(200).send('Successfully Reported');
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}

exports.reportProduct = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    if (!user) {
      return res.status(500).send('Please log in or create an account to report');
    }
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const vendorEmail = (await Vendor.findById(req.body.vendorID)).email;
    const productName = (await Product.findById(req.body.product, { product_name: 1 })).product_name;
    const newReport = new Report({
      user: user._id,
      vendor: req.body.vendorID,
      product: req.body.product,
      title: req.body.title,
      description: req.body.description,
      date: Date.now(),
    })
    await newReport.save();
    if (emailRegex.test(vendorEmail)) {
      sendProductReportNotificationEmail(vendorEmail, productName, req.body.title, req.body.description)
    }
    return res.status(200).send('Successfully Reported');
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error })
  }
}
exports.followVendor = async (req, res) => {
  try {
    let user = await authenticateToken(req.cookies.userToken);
    const vendor = await Vendor.findById(req.body.vendorID)
    const followerList = await FollowerList.findOne({ vendorID: req.body.vendorID })
    if (!vendor) {
      return res.status(500).json({ error: "Cannot find the vendor." })
    }
    if (!followerList) {
      const newFollowerList = new FollowerList({
        vendorID: req.body.vendorID,
        followers: [{
          userID: user._id
        }]
      })
      await newFollowerList.save()
    } else {
      const isFollowing = await FollowerList.exists({
        vendorID: req.body.vendorID,
        "followers.userID": user._id
      });
      if (isFollowing) {
        return res.status(400).json({ error: "User is already following the vendor." });
      }
      followerList.followers.push({ userID: user._id });
      await followerList.save();
    }
    return res.status(200).json({ following: true });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error Occured" });
  }
}

exports.unfollowVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.body.vendorID);
    if (!vendor) {
      return res.status(500).json({ error: "Cannot find the vendor." });
    }
    const result = await FollowerList.updateOne(
      { vendorID: req.body.vendorID },
      { $pull: { followers: { userID: req.body.userID } } }
    );
    if (result.nModified === 0) {
      return res.status(500).json({ error: "User is not following the vendor." });
    }
    return res.status(200).json({ following: false });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message || "Error Occurred" });
  }
};

exports.checkFollow = async (req, res) => {
  try {
    const followerList = await FollowerList.findOne({ vendorID: req.params.vendorID });
    let following = false;
    if (followerList) {
      const isUserIDExists = followerList.followers.some(follower => follower.userID.equals(req.params.userID));
      following = isUserIDExists;
    }
    return res.status(200).json({ following: following });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error Occurred" });
  }
}

exports.viewComments = async (req, res) => {
  const productId = req.params.id
  const product = await Product.findById(productId);
  try {
    if (product) {
      const comments = await Comment.find({ productId: productId })
      const commentsJson = comments.map(comment => {
        const commentJson = comment.toJSON();
        if (commentJson.userImg) {
          commentJson.userImg = Buffer.from(commentJson.userImg.data).toString("base64");
        }
        commentJson.replyMessage.map(reply => {
          if (reply.userImg) {
            reply.userImg = Buffer.from(reply.userImg.data).toString("base64");
          }

          if (reply.vendorImg) {
            reply.vendorImg = Buffer.from(reply.vendorImg.data).toString("base64");
          }

          return reply;
        })
        return commentJson;
      });

      res.json({ comments: commentsJson });
    } else {
      res.status(500).json({ message: 'Comments not found' })
    }

  } catch (error) {
    console.log(error.message)
    res.status(501).json({ message: 'There was an error getting comments for this Product' });
  }
}

exports.postComment = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  let user = await authenticateToken(req.cookies.userToken);
  if (!user) {
    return res.status(500).json({ error: "Please log in or create an account to comment" })
  }
  if (!product) {
    return res.status(500).json({ error: "This product does not exist" })
  }
  const { newComment, title } = req.body;
  try {
    user = await User.findById(user._id, { name: 1, img: 1 });
    const comment = await Comment.create({
      title: title,
      productId: new mongoose.Types.ObjectId(productId),
      commentText: newComment,
      userName: user.name,
      userImg: user.img,
    })
    return res.status(200).json({ msg: "Add comment successfully", commentId: comment._id });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

exports.replyComment = async (req, res) => {
  let user = await authenticateToken(req.cookies.userToken);
  if (!user) return res.status(401).json({ error: "Please log in or create an account to reply" });
  const { replyText } = req.body;
  const comment_id = req.params.id;
  try {
    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    user = user.role === 'User' ? await User.findById(user._id) : await Vendor.findById(user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const reply = {
      commentId: comment_id,
      userName: user.name || user.businessName,
      userImg: user.img,
      replyText: replyText
    };

    await Comment.findByIdAndUpdate(comment_id, { $push: { replyMessage: reply } });
    return res.status(200).json({ msg: "Reply comment successfully" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'There was an error replying to the comment' });
  }
};

exports.likeComment = async (req, res) => {
  let user = await authenticateToken(req.cookies.userToken);
  if (!user) return res.status(500).json({ error: "Please log in or create an account to like" });
  const commentId = req.params.id;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.likeComment(user._id);
    return res.status(200).json({ msg: "Like comment successfully", comment: comment });
  } catch (error) {
    res.status(500).json({ message: 'There was an error updating the comment' });
  }
};

exports.adminManageProduct = async (req, res) => {
  try {
    const query = req.params.query.split("=")[1];
    let products;

    if (query) {
      const regex = new RegExp(query, 'i');
      products = await Product.find({
        $or: [
          { product_name: regex },
          { category: regex },
        ]
      });
    } else {
      products = await Product.find({});
    }

    const reportedProductIds = await Report.distinct('product');
    for (let i = 0; i < products.length; i++) {
      const productObj = products[i].toObject();
      const isReported = reportedProductIds.map(id => id.toString()).includes(products[i]._id.toString());
      productObj.isReported = isReported;
      products[i] = productObj;
    }
    return res.status(200).json({ products: products });
  } catch (error) {
    return res.status(500).json({ error: "Cannot find products." });
  }
}

exports.adminManageReportedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const reports = await Report.find({ product: req.params.id });

    const reportsWithUser = await Promise.all(reports.map(async (report) => {
      const reportJson = report.toJSON();
      reportJson.user = convertUser(await User.findById(reportJson.user, { name: 1, img: 1, email: 1 }));
      return reportJson;
    }));

    if (!product) {
      return res.status(500).json({ error: "Cannot find the product." })
    }
    const vendor = convertUser(await Vendor.findById(product.owner, { businessName: 1, email: 1, phoneNumber: 1, address: 1, img: 1 }));
    return res.status(200).json({ product: product, vendor: vendor, reports: reportsWithUser });
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}