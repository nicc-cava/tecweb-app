export const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({error: "Access denied. You have to log in."});
    }
};
