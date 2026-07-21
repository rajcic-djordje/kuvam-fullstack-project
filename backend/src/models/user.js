import mongoose from "mongoose";
import { USER_ROLES, USER_STATUS } from "../constants/user.js";


const userSchema = new mongoose.Schema({

    firstName: {type: String, required: true, trim: true, minlength: 2, maxlength: 50},
    lastName: {type: String, required: true, trim: true, minlength: 2, maxlength: 50},
    email: {type: String, required: true, trim: true, unique: true, lowercase: true},
    passwordHash: {type: String, required: true, select: false},
    role: {type: String, required: true, enum: Object.values(USER_ROLES)},
    status: {type: String, required: true, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE},
    reportsCount: {type: Number, default: 0, min: 0},
    offences: {type: Number, default: 0, min:0},
    suspensionReason: {type:String, trim: true, maxlength: 500, default:null},
    banReason: {type: String, trim: true, maxlength: 500, default: null}
}, {timestamps: true})



const userModel = mongoose.model("User", userSchema)


export default userModel