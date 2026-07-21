import z from "zod"


const suspendUserSchema = z.object({
    reason: z.string().trim().min(3).max(500)
})


export {suspendUserSchema}