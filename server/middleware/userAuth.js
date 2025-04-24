import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {

    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Not authorize Login Again"});
    }

    try{
        const tokendecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokendecode.id){
            req.userId = tokendecode.id;
            next();
        }else{
            return res.json({success: false, message: "Not authorize, try again"})
        }
        
    }catch(error){
        res.json({success: false, message: "error userAuth" +error.message});
    }
}

export default userAuth;