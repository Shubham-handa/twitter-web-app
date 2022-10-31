import jwt from 'jsonwebtoken'

const requireAuth = (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];

    if(token){
        jwt.verify(token,'LaughingBuddhaJutsu',(err,decodedToken)=>{
            next();
        })
    }
}

export default requireAuth;