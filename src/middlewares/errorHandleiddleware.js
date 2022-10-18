export const errorHandleMiddleware = (err, _, res, __ ) =>{
    return res.json(err.status).json({
        message: err.message,
        status: err.status
    })
}