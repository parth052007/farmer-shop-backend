import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String },
      mr: { type: String }
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    image: {
      type: String
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    marketPrice: {
      type: Number,
      default: null
    },

    rejectReason: {
      type: String,
      default: ""
    },

    farmer: {
      email: {
        type: String,
        required: true
      },
      phone: {
    type: String,
    default: "Not Available"
  },
      address: {
        type: String,
        default: "Not Provided"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
