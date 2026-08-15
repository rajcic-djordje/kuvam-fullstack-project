import express from "express"
import {
    deleteOfferListing,
    createOfferListing,
    getAvailableOfferById,
    getAvailableOffers,
    getMyOffers,
    updateOfferListing,
    activateOfferListing,
    deactivateOfferListing,
    uploadOfferImage,
    deleteOfferImage
} from "../controllers/offerController.js"
import {authenticate} from "../middleware/authenticate.js"
import {authorize} from "../middleware/authorize.js"
import {USER_ROLES} from "../constants/user.js"
import {validateBody} from "../middleware/validateBody.js"
import {
    createOfferSchema,
    updateOfferSchema
} from "../validators/offerValidator.js"
import {validateObjectId} from "../middleware/validateObjectId.js"
import {validateQuery} from "../middleware/validateQuery.js"
import {offerQuerySchema} from "../validators/queryValidator.js"
import {optionalAuthenticate} from "../middleware/optionalAuthenticate.js"
import uploadOfferImageMiddleware from "../middleware/uploadOfferImage.js"

const router = express.Router()

router.post(
    "/",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateBody(createOfferSchema),
    createOfferListing
)

router.get(
    "/mine",
    authenticate,
    authorize(USER_ROLES.SELLER),
    getMyOffers
)

router.patch(
    "/:offerId/image",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("offerId"),
    uploadOfferImageMiddleware.single("image"),
    uploadOfferImage
)

router.delete(
    "/:offerId/image",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("offerId"),
    deleteOfferImage
)

router.patch(
    "/:offerId/activate",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("offerId"),
    activateOfferListing
)

router.patch(
    "/:offerId/deactivate",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("offerId"),
    deactivateOfferListing
)

router.patch(
    "/:offerId",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("offerId"),
    validateBody(updateOfferSchema),
    updateOfferListing
)

router.get(
    "/",
    optionalAuthenticate,
    validateQuery(offerQuerySchema),
    getAvailableOffers
)

router.get(
    "/:offerId",
    validateObjectId("offerId"),
    getAvailableOfferById
)

router.delete(
    "/:offerId",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("offerId"),
    deleteOfferListing
)

export default router