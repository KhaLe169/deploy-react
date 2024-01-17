const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true
      },
      image_link: {
        type: String,
      },
      price: {
        type: Number,
        require: true,
      },
      product_name: {
        type: String,
        require: true,
      },
    }
  ],
  shippingAddress: {
    type: String,
    require: true,
  },
  contactNumber: {
    type: String,
    require: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  vendorID: {
    type: mongoose.Types.ObjectId,
    ref: "Vendor",
    require: true,
  },
  vendorBusinessName: {
    type: String,
    require: true,
  },
  vendorAddress: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  city: {
    type: String,
    require: true,
  },
  shippingFee: {
    type: Number,
    require: true,
  },
  ward: {
    type: String,
    require: true,
  },
  district: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Unpaid", "To Ship", "Shipping", "Completed", "Cancelled", "Failed Delivery"],
    default: "Unpaid",
  },
});

module.exports = mongoose.model('Order', orderSchema)