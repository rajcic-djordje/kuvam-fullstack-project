const validateQuery = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query)

        if (!result.success) {
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Query validation failed.",
                    details: result.error.flatten()
                }
            })
        }

        req.queryData = result.data

        return next()
    }
}

export { validateQuery }