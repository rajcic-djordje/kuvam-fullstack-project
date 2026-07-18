
class AppError extends Error{


    constructor(message, statusCode, code){
        super(message)

        this.name = "Application Error"
        this.statusCode = statusCode
        this.code = code 
    } 

}


export default AppError