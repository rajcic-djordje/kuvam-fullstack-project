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
    offencesSinceLastBan: {type: Number,default: 0,min: 0},
    suspensionReason: {type:String, trim: true, maxlength: 500, default:null},
    suspendedAt: {type: Date, default: null},
    banReason: {type: String, trim: true, maxlength: 500, default: null},
    passwordResetCodeHash: {type: String, default: null, select: false},
    passwordResetCodeExpiresAt: {type: Date, default: null, select: false},
    passwordResetAttempts: {type: Number, default: 0, min: 0, select: false},
    passwordResetLastSentAt: {type: Date, default: null, select: false},
    city: {type: mongoose.Schema.Types.ObjectId, ref: "City", default: null},
    address: {
    street: {type: String, trim: true, maxlength: 150, default: null},
    streetNumber: {type: String, trim: true, maxlength: 20, default: null},
    additionalInfo: {type: String, trim: true, maxlength: 300, default: null},
    latitude: {type: Number, min: -90, max: 90, default: null},
    longitude: {type: Number, min: -180, max: 180, default: null}
}
}, {timestamps: true})



const userModel = mongoose.model("User", userSchema)



export default userModel