import Store from "../Models/storeModel.js";

// CREATE STORE
export const createStore = async (req, res) => {
  try {
    const { name, email, category, description } = req.body;

    // 1 Check if user already has a store
    const existingStore = await Store.findOne({ owner: req.user._id });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: "Store already exists",
      });
    }

    // 2 Handle logo upload (optional)
    const logo = req.file ? req.file.path : "";

    // 3 Create store
    const store = await Store.create({
      name,
      email,
      category,
      description,
      logo,
      owner: req.user._id,
    });

    // 4 UPDATE USER → SELLER
    req.user.hasStore = true;
    req.user.storeId = store._id;
    req.user.role = "seller";   // 🔥 THIS LINE IS IMPORTANT

    await req.user.save();

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    console.error("Create store error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};