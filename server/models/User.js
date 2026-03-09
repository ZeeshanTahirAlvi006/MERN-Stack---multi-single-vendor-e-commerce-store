import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { generateJWTToken } from '../utils/jwtUtils.js'

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

// Hash password before saving
UserSchema.pre("save", async function(){
    if(!this.isModified('password')){
        return;
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function(passwordfromuser){
    return await bcrypt.compare(passwordfromuser, this.password);
}

UserSchema.methods.generateJWTToken = function(){
    return generateJWTToken(this._id, this.role);
}

export default mongoose.model("User", UserSchema)