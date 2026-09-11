const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        try {
            if(!roles.includes(req.user.role)) {
                return res.status(403).json({message : "Access Denied : You are not authorized"});
            }
            next();
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({message : "Internal server error"})
        }
    }
}

export default authorizeRoles;