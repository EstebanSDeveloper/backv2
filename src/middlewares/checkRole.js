export const checkRole = (roles) => {
    return (req, res, next ) => {
        if (!req.user) {
            return res.json({status:"error", message:"necesitas estar autenticado"})
        } if (!roles.includes(req.user.role)){
            return res.json({status:"error", message:"tu rol no está autorizado para realizar esta acción o entrar a esta sección"})
        }
        next()
    }
}   