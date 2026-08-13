import multer from "multer"
import path from "node:path"
import crypto from "node:crypto"
import fs from "node:fs"

const uploadDirectory = path.resolve("uploads/offers")

fs.mkdirSync(uploadDirectory, {
    recursive: true
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory)
    },
    filename: (req, file, cb) => {
        const extension =
            path.extname(file.originalname).toLowerCase()

        cb(
            null,
            `${crypto.randomUUID()}${extension}`
        )
    }
})

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
]

const fileFilter = (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error(
                "Only JPEG, PNG and WEBP images are allowed."
            )
        )
    }

    cb(null, true)
}

const uploadOfferImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

export default uploadOfferImage