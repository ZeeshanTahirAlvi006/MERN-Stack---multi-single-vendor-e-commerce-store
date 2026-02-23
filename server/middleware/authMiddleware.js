import bcrypt from 'bcrypt'

export const hashPassword = async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(24);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
        next(error);
    }
}
export const comparePassword =  async function(passwordfromuser){
    return await bcrypt.compare(passwordfromuser,this.password);
}