import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      email: { type: String, required: true },
      name: { type: String, required: true },
      phone: { type: String },
  address: { type: String }
    },

    farmerEmail: {
      type: String,
      required: true
    },
    farmerPhone: {
  type: String,
  required: false
},

    product: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: {
        en: String,
        hi: String,
        mr: String
      },
      price: Number,
      marketPrice: Number,
      image: String
    },

    quantity: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["placed", "accepted", "rejected", "delivered"],
      default: "placed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
