import mongoose from "mongoose";

const productsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product Price"],
        maxlength:[7,"Price Cannot Be Exceed 7 Digits"]
    },
    description:{
        type:String,
        required:[true,"Please Enter Product Description"],
    },
    madeUpOf:{
        type:String,
        required:[true,"Please Enter Product Ingredients"],
    },
    quantity:{
        type:String,
        required:[true,"Please Enter Product Quantity"],
    },
    containerType:{
        type:String
    },
    foodType:{
        type:String,
    },
    expireDate:{
        type:Date,
    },
    ratings:{
        type:Number,
        default:0
    },
    image:[
        {
        image_Id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"],
    },
    returnPolicy:{
        type:Boolean,
        required:[true,"Please Enter Product returnPolicy"],
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product stock"],
        maxlength:[5,"Price Cannot Be Exceed 5 Digits"],
        default:1
    },
    noOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        },
    }] ,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true

    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    }
});

export default mongoose.model("Product",productsSchema);