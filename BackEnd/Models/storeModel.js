import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Store email is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Store category is required"],
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
    },
    logo: {
      type: String, // path to uploaded logo
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one store per user
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);

export default Store;