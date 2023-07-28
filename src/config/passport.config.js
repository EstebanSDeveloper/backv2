import passport from "passport";
import jwt from "passport-jwt"
import { options } from "./options.js";
import { UserModel } from "../daos/models/user.model.js";
  

const jwtStrategy = jwt.Strategy;
const extractJWT  = jwt.ExtractJwt;

export const initializePassport = () => {

	// creamos la estrategia con passport-jwt
	passport.use("authJWT", new jwtStrategy(
		{
			// extraer token de la cookie 
			jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
			secretOrKey: options.server.secretToken 
		},
		async (jwt_payload, done) => {
			try {
				// Aquí agregamos la línea para actualizar la última fecha de conexión del usuario.
				const user = jwt_payload; // Asumiendo que el payload del token contiene información del usuario.
				user.last_connection = new Date();
				const usedUpdated = await UserModel.findByIdAndUpdate(user._id, user)
				return done(null, jwt_payload, usedUpdated)
			} catch (error) {
				return done({status:"error", message: error.message});
			}
		}
	))
};

export const cookieExtractor = (req) => {
	let token = null 
	if (req && req.cookies) {
		// extraemos el token de la cookie
		token = req.cookies[options.server.cookieToken]
	} 
	return token
}


