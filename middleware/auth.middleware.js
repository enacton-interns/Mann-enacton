import jwt from "jsonwebtoken"

const isAuth = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message : "Unauthorized"})
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({message : "Unauthorized"})
    }
}

export default isAuth