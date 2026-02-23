import mongoose from "mongoose"
import { hashPassword,comparePassword } from "../middleware/authMiddleware";
import {createJWTToken} from '../utils/jwtUtils'

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: [2, "Name can not be less than 2 characters"],
        maxlength: [50,"Name can not exceed 50 characters"],
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
        validate:{
        validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
    },
        trim:true
    },
    password:{
        type:String,
        minlength:[8,"Password can not be less than 8 characters"],
        select:false,
    },
    role:{
        type:String,
        required:true,
        enum:['admin','vendor','customer'],
        default: 'customer',
    },
    storeInfo:{
        name:{
            type:String,
            required: false,
            minlength: [2, "Name can not be less than 2 characters"],
            maxlength: [50,"Name can not exceed 50 characters"],
            trim:true
        },
        description:{
            type:String,
            required: false,
            minlength: [200, "Description can not be less than 200 characters"],
            maxlength: [1000,"Description can not exceed 1000 characters"],
            trim:true
        },
        logo:{
            type: String,
            required:false,
        }
    },
    isActive:{
        type:Boolean,
        default:true,
        required:false,
    }
},{timestamps:true})
UserSchema.pre("save",hashPassword);
UserSchema.methods.comparePassword = comparePassword;
UserSchema.methods.generateJWTToken = function(){
    return createJWTToken(this._id);
}
export default mongoose.model("User",UserSchema)