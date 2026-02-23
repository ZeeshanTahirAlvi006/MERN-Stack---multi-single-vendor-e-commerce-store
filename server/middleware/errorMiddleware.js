export const notFound = (req,res,next)=>{
    const error = new Error(`Not found- ${req.originalURL}`);
    res.status(404);
    next(error);
}
export const errorHandler = (error,req,res,next)=>{
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = error.message;
    if(error.name === 'CastError'&& error.kind === 'ObjectId'){
        statusCode = 404,
        message = "Resource not found.";
    }
    if(error.code === 11000){
        statusCode = 400;
        message = `Duplicate field value entered ${Object.keys(error.keyValue)}`;
    }
    if(error.name === 'ValidationError'){
        statusCode = 400;
        message = Object.values(error.errors).map(val=>val.message).join(",");
    }
    res.status(statusCode).json({
        success:false,
        message,
        stack: process.env.NODE_ENV === 'production'?null:error.stack,
    });
}