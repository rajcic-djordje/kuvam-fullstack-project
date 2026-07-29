import { approveSeller, getPendingSellers, rejectSeller } from "../services/adminSellerService.js"


const getPendingSellerApplications = async(req, res) => {
    const search =
        typeof req.query.search === "string"
            ? req.query.search.trim()
            : ""

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest"

    const sellers = await getPendingSellers(search, sort)

    return res.status(200).json({
        sellers
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