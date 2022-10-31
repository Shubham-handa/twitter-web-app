const errorHandler = (error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.send(error.message || 'An unknown error occured');
}

export default errorHandler;