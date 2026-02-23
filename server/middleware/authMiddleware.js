import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const hashPassword = async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next(error);
    }
}
export const comparePassword =  async function(passwordfromuser){
    return await bcrypt.compare(passwordfromuser,this.password);
}
export const protectRole = async function(req,res,next){
    let token;
    if(req.headers.authorization?.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        }catch(error){
            return res.status(401).json({
                message: "Not authorized. Token failed!."
            })
        }
    }
    if(!token){
        return res.status(401).json({
            message:"Not authorized. No token."
        })
    }
};