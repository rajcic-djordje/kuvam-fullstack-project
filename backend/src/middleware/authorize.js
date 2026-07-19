import AppError from "../errors/appError.js";



const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.auth)
            return next(
                new AppError("Authentication required.",401,"AUTHENTICATION_REQUIRED")
        )

        
        if(!allowedRoles.includes(req.auth.role))
            return next(
                new AppError("You do not have permission to perform this action.", 403, "FORBIDDEN")
            )

    

        return next()
    }
}

export {authorize}