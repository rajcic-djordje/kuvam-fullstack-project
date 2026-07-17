
const errorHandler = (err,req,res,next) => {

    const status = err.statusCode ?? 500
    const isExpectedError = err.statusCode != null;
    const code = isExpectedError? err.code: "INTERNAL_SERVER_ERROR"
    const message = isExpectedError? err.message: "Unexpected error occurred."
    


    const error = {
        error:
        {
        "code" : code,
        "message" : message
    }
}

    return res.status(status).json(error)
}

export {errorHandler}