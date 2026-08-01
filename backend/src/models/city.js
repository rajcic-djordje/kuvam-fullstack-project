import mongoose from "mongoose"

const citySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, unique: true, minlength: 2, maxlength: 100},
    slug: {type: String, required: true, trim: true, unique: true, lowercase: true, minlength: 2, maxlength: 120},
    isActive: {type: Boolean, required: true, default: true}
}, {timestamps: true})

const cityModel = mongoose.model("City", citySchema)

export default cityModel