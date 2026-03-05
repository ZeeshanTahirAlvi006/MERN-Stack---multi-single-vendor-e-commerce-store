import mongoose from 'mongoose'

export const OrderSchema = new mongoose.Schema({
    customerId:{
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
    },
    items:[
        {
            productId:{
                ref: 'Product',
                type: mongoose.Schema.Types.ObjectId,
            },
            name:{
                type: String,
                trim: true,
            },
            qty:{
                type: Number,
                min:[1,"Qty can not be less than 1"]
            },
            price:{
                type:   Number,
                min:[0,"Price can not be less than 0"]
            },
            vendorId:{
                ref: 'User',
                type:mongoose.Schema.Types.ObjectId,
            },
            itemRevenue: { 
                type: Number,
                 default: 0 
                },
            platformFee: { 
                type: Number,
                 default: 0 
                },
            vendorPayout: { 
                type: Number,
                 default: 0 
                },
            }
    ],
    shippingAddress:{
        name:{
            type:String,
            required:true,
            minlength:[2,"Name can not be less than 2 characters"],
            maxlength:[50,"Name can not exceed 50 characters"],
            trim:true,
        },
        street:{
            type: String,
            required:true,
            minlength:[10, "Street can not be less than 10 characters"],
            trim:true,
        },
        city:{
            required:true,
            type:String,
            trim:true,
            minlength:[2,"City name can not be less than 2 characters"]
        },
        zip:{
            type:String,
            minlength: [4,"Zip code can not be less than 4 characters"]
        },country:
        {
            type:String,
            required:true,
            minlength:[2,"Country can not be less than 2 characters"],
        }

    },
    paymentMethod:{
        type:String,
        required:true,
        trim:true,
    },
    stripeSessionId:{
        required:false,
        type:String,
        trim:true,
    },
    total:{
        type:Number,
        required:true,
        min:[0,"Total can not be less than 0"]
    },
    platformFee:{
        type:Number,
        default:0,
    },status:{
        type:String,
        enum:["Awaiting Payment","Pending","Paid","Shipped","Delivered","Cancelled"]
    },paidAt:{
        type:Date,
        validate:{
            validator:function(value){
                return !value || value >= this.createdAt;
            },
            message:"Payment date can not be before order creation date."
        }
    },
    
},{timestamps:true})
OrderSchema.index({customerId:1});
OrderSchema.index({"items.vendorId":1})
OrderSchema.pre('save', function() {
    let totalOrderRevenue = 0;
    let totalOrderPlatformFee = 0;
    this.items.forEach(item => {
        item.itemRevenue = item.price * item.qty;
        item.platformFee = item.itemRevenue * 0.10;
        item.vendorPayout = item.itemRevenue - item.platformFee;
        totalOrderRevenue += item.itemRevenue;
        totalOrderPlatformFee += item.platformFee;
    });
    this.total = totalOrderRevenue;
    this.platformFee = totalOrderPlatformFee;
})
export default mongoose.model('Order',OrderSchema)