import mongoose from "mongoose"
import AppError from "../errors/appError.js"

const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const value = req.params[paramName]

        if (!mongoose.isValidObjectId(value))
            return next(new AppError(`Invalid ${paramName}.`,400,"INVALID_ID"))

        return next()
    }
}

export { validateObjectId }