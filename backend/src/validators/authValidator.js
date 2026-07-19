import { z } from "zod"
import { USER_ROLES } from "../constants/user.js"

const registerSchema = z.object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8),
    role: z.enum([
        USER_ROLES.BUYER,
        USER_ROLES.SELLER
    ]),
    businessName: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).optional()
}).refine( (data) => {
    
    if(data.role==USER_ROLES.SELLER)
        return data.businessName!==undefined

    return true
        
},
{
    message: "Business name required for sellers.",
    path: ["businessName"]
})


const loginSchema = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1)
})

export { registerSchema, loginSchema }