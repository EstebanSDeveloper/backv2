import { renderSignup } from "../controllers/web.controller.js";

// Middleware para verificar la autenticación del usuario
export const checkAuthentication = (req, res, next) => {
    // passport.authenticate agregará el usuario autenticado a req.user si la autenticación fue exitosa
    if (req.isAuthenticated()) {
      // Si el usuario está autenticado, llamamos a next() para continuar con el controlador renderProducts
      return next();
    }
  
    // Si el usuario no está autenticado, redirigimos al usuario a la página de registro (signup)
    return renderSignup(req, res); // Llama a la función renderSignup directamente y pasa req y res como argumentos
}