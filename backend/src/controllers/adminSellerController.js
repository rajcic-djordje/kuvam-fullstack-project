import { approveSeller, getPendingSellers, rejectSeller } from "../services/adminSellerService.js"


const getPendingSellerApplications = async (req,res) => {

    const result = await getPendingSellers()

    return res.status(200).json({
        message: "Pending seller applications retrieved successfully.",
        result

    })
}

const approveSellerApplication = async (req,res) => {

    const sellerId = req.params.sellerId

    const seller = await approveSeller(sellerId)

    return res.status(200).json({
        message: "Seller application approved successfully.",
        seller
    })
}

const rejectSellerApplication = async (req,res) => {
    const sellerId = req.params.sellerId
    const reason = req.body.reason
    const seller = await rejectSeller(sellerId, reason)
    return res.status(200).json({
        message: "Seller application rejected successfully.",
        seller
    })

}


export {getPendingSellerApplications, approveSellerApplication, rejectSellerApplication}