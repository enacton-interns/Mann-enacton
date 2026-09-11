const authorizeRoles = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role
        if(role !== userRole){
            return res.status(403).json({ success: false, error: "Unauthorized" });
        }
        next()
    }
}

export default authorizeRoles