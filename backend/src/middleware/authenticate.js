import AppError from "../errors/appError.js";
import { verifyAccessToken } from "../utils/jwt.js";


const authenticate = (req,res,next) =>{

    const header = req.headers.authorization
    
    if(!header)
        return next(
        new AppError("Authentication required.", 401, "AUTHENTICATION_REQUIRED")
    )

    const schema = header.split(" ")[0]
    const token = header.split(" ")[1]

    if(schema!=="Bearer" || !token) 
       return next(new AppError("Invalid authorization format.", 401, "INVALID_AUTHORIZATION_FORMAT")
    ) 

    try{
        const decoded = verifyAccessToken(token)
        req.auth = {
            userId: decoded.userId,
            role: decoded.role
        }

        return next()
        
    }
    catch(error)
    {
        return next(
            new AppError("Invalid or expired access token.", 401, "INVALID_ACCESS_TOKEN")
        )
    }

}

export {authenticate}
