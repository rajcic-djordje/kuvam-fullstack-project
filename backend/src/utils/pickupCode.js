import crypto from "node:crypto"
import env from "../config/env.js"

const PICKUP_CODE_LENGTH = 6
const PICKUP_CODE_RANGE = 10 ** PICKUP_CODE_LENGTH

const generatePickupCode = (
    orderId,
    generatedAt
) => {
    const source =
        `${String(orderId)}:${generatedAt.getTime()}`

    const hash = crypto
        .createHmac(
            "sha256",
            env.pickupCodeSecret
        )
        .update(source)
        .digest()

    const value =
        hash.readUInt32BE(0) %
        PICKUP_CODE_RANGE

    return String(value).padStart(
        PICKUP_CODE_LENGTH,
        "0"
    )
}

const isPickupCodeValid = (
    order,
    submittedCode
) => {
    if (!order.pickupCodeGeneratedAt)
        return false

    const expectedCode = generatePickupCode(
        order._id,
        order.pickupCodeGeneratedAt
    )

    const expectedBuffer =
        Buffer.from(expectedCode)

    const submittedBuffer =
        Buffer.from(submittedCode)

    if (
        expectedBuffer.length !==
        submittedBuffer.length
    )
        return false

    return crypto.timingSafeEqual(
        expectedBuffer,
        submittedBuffer
    )
}

export {
    generatePickupCode,
    isPickupCodeValid
}