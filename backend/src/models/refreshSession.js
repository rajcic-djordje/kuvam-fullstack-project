import mongoose from "mongoose"

const refreshSessionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    tokenHash: {type: String, required: true, unique: true},
    expiresAt: {type: Date, required: true, index: {expires: 0}},
    revokedAt: {type: Date, default: null},
    replacedByTokenHash: {type: String, default: null}
}, {
    timestamps: true
})

const refreshSessionModel = mongoose.model("RefreshSession", refreshSessionSchema)

export default refreshSessionModel