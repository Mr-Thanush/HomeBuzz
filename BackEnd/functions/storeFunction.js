import Store from "../Models/storeModel.js";

// CREATE STORE
export const createStore = async (req, res, next) => {
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

    // 2 Handle logo upload
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

    // 4 Promote user to SELLER
    req.user.hasStore = true;
    req.user.storeId = store._id;
    req.user.role = "seller";

    await req.user.save();

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    next(error); 
  }
};

// GET MY STORE
export const getMyStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
};