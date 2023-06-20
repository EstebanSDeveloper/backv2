import passport from "passport";
import jwt from "passport-jwt"
import { options } from "./options.js";
  

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
				return done(null, jwt_payload)
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
