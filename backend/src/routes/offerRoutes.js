import express from 'express'
import { createOfferListing, getMyOffers, activateOfferListing, deactivateOfferListing } from '../controllers/offerController.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { USER_ROLES } from '../constants/user.js'
import { validateBody } from '../middleware/validateBody.js'
import { createOfferSchema } from '../validators/offerValidator.js'

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
    "/:offerId/activate",
    authenticate,
    authorize(USER_ROLES.SELLER),
    activateOfferListing
)

router.patch(
    "/:offerId/deactivate",
    authenticate,
    authorize(USER_ROLES.SELLER),
    deactivateOfferListing
)



export default router