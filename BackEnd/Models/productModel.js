import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: 
  { type: String, 
    required: true, 
    trim: true 
}
  ,
  discription: 
  { 
    type: String, 
    required: true, 
    trim: true 
},
  price: 
  { type: Number, 
    required: true, 
    max: 9999999 
},
  ratings: 
  { type: Number, 
    default: 0 
},
  images: [
    { public_id: String, 
        url: String 
    }
    ],
  category: 
  { 
    type: String, 
    required: true, 
    trim: true 
},
  stock: 
  { 
    type: Number, 
    required: true, 
    default: 1 
},
  brand: 
  { 
    type: String,
     default: "Brand" 
    },
  about: 
  { 
    type: String,
     default: "No description" 
    },
  discount: 
  { 
    type: Number,
     default: 0 
    },
  sold: 
  { 
    type: Number,
     default: 0 
    },
  noOfReviews:
   { 
    type: Number, 
    default: 0 
},
  reviews: [
    {
      user: 
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true },
      name: 
      { 
        type: String, 
        required: true 
    },
      rating: 
      { 
        type: Number, 
        required: true 
    },
      comment: 
      {
         type: String, 
         required: true 
        },
    }
  ],
  user:
   {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", 
     required: true
     },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);