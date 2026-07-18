import AppError from "../errors/appError.js";


const validateBody = (schema) => {
    return (req,res,next)=>{

        const result = schema.safeParse(req.body)

        if(!result.success) {
            return next(
                new AppError(
                    "Invalid request data.",
                    400,
                    "VALIDATION_ERROR"
                )
            )
        }

        req.body = result.data

        next()
    }
}


export {validateBody}