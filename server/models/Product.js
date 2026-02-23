import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength: [120,"Name can not exceed 120 characters"],
    },
    description:{
        type: String,
        required:true,
        maxlength:[2000,"Description can not exceed 2000 characters"]
    },
    price:{
        type: Number,
        required:true,
        min:[0,"Price can not be less than 0"]
    },
    images:{
        type:[String],
        validate: {
            validator: function(val){
                return val.length > 0;
            },
            message: "At least 1 image is required."
        }
    },
    stock:{
        type:Number,
        default: 0,
        required:true,
        min:[0, "Stock can not be less than 0"]
    },
    vendorid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true,"Product must belong to a vendor"],
    },
    isActive:{
        type: Boolean,
        default:true,
    },
    category:{
        type:String,
        required:true,
        enum:{
            values: ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'],
            message: '{VALUE} is not a valid category. Please choose from the allowed list.'
        },
        trim:true,
    },
    
},{timestamps:true})
export default mongoose.model('Product',ProductSchema)