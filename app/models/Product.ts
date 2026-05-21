import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "../types";


interface IProductDocument extends Omit<IProduct, "_id">, mongoose.Document {}

const ProductSchema: Schema<IProductDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Image publicId is required"],
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner user reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProductDocument> = mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);

export default Product;