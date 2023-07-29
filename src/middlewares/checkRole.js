export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "AuthenticationError", message: "Necesitas estar autenticado para realizar esta acción o acceder a esta sección." });
        } 
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "ForbiddenError", message: "Tu rol no está autorizado para realizar esta acción o acceder a esta sección." });
        }
        
        next();
    };
};
