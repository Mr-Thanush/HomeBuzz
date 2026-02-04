import Store from "../Models/storeModel.js";
import fs from "fs";

// CREATE STORE
export const createStore = async (req, res) => {
  try {
    const { name, email, category, description } = req.body;

    // Check if user already has a store
    const existingStore = await Store.findOne({ owner: req.user._id });
    if (existingStore) {
      return res.status(400).json({ success: false, message: "Store already exists" });
    }

    // Handle logo file
    const logo = req.file ? req.file.path : "";

    const store = await Store.create({
      name,
      email,
      category,
      description,
      logo,
      owner: req.user._id,
    });

    // Update user as seller
    req.user.hasStore = true;
    req.user.storeId = store._id;
    await req.user.save();

    res.status(201).json({ success: true, store });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY STORE
export const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });

    res.json({ success: true, store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};