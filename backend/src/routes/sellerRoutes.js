import express from "express"
import {
    getMySellerProfile,
    updateMySellerProfile,
    uploadMySellerProfileImage,
    deleteMySellerProfileImage,
    uploadMySellerCoverImage,
    deleteMySellerCoverImage,
    getSellers,
    getSellerBySlug
} from "../controllers/sellerController.js"
import {authenticate} from "../middleware/authenticate.js"
import {authorize} from "../middleware/authorize.js"
import {validateBody} from "../middleware/validateBody.js"
import {USER_ROLES} from "../constants/user.js"
import {updateSellerProfileSchema} from "../validators/sellerValidator.js"
import {optionalAuthenticate} from "../middleware/optionalAuthenticate.js"
import uploadSellerImage from "../middleware/uploadSellerImage.js"
import {validateQuery} from "../middleware/validateQuery.js"
import {sellerQuerySchema} from "../validators/queryValidator.js"


const router = express.Router()

router.get(
    "/",
    optionalAuthenticate,
    validateQuery(sellerQuerySchema),
    getSellers
)

router.get(
    "/me",
    authenticate,
    authorize(USER_ROLES.SELLER),
    getMySellerProfile
)

router.patch(
    "/me",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateBody(updateSellerProfileSchema),
    updateMySellerProfile
)

router.patch(
    "/me/profile-image",
    authenticate,
    authorize(USER_ROLES.SELLER),
    uploadSellerImage.single("image"),
    uploadMySellerProfileImage
)

router.delete(
    "/me/profile-image",
    authenticate,
    authorize(USER_ROLES.SELLER),
    deleteMySellerProfileImage
)

router.patch(
    "/me/cover-image",
    authenticate,
    authorize(USER_ROLES.SELLER),
    uploadSellerImage.single("image"),
    uploadMySellerCoverImage
)

router.delete(
    "/me/cover-image",
    authenticate,
    authorize(USER_ROLES.SELLER),
    deleteMySellerCoverImage
)

router.get(
    "/:slug",
    getSellerBySlug
)

export default router