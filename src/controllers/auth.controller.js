import { UserManagerMongo } from "../daos/managers/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js";
import { isValidPassword, createHash } from "../utils.js";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";

const userManager = new UserManagerMongo(UserModel);

export const tokenSignupController = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const user = await userManager.getUserByEmail(email);
        if (!user) {
            let role='user';
	        if (email.endsWith("@coder.com")) {
	            role = "admin";
	        }
            const newUser = {
                first_name, 
                last_name, 
                email,
                password: createHash(password),
                role
            }
            const userCreated = await userManager.addUser(newUser)
            // le asignamos un token al usuario
            const token = jwt.sign({ first_name: userCreated.first_name, last_name: userCreated.last_name, email: userCreated.email, role: userCreated.role,  _id: userCreated._id},
            options.server.secretToken,{ expiresIn: "24h" });
			res.cookie(options.server.cookieToken, token, {
				httpOnly: true,
			}).redirect("/products");
        } else {
            res.send(`<div>el usuario ya está registrado, <a href="/login">Loguearse</a></div>`);
        }

    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
}

export const tokenLoginController = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userManager.getUserByEmail(email);
		if (user) {
			// validar contraseña
			if (isValidPassword(password, user)) {
				// generar el token para ese usuario; esta es la información que se va a guardar en el token
				const token = jwt.sign({ first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role, _id: user._id},
                options.server.secretToken,{ expiresIn: "24h" });
				res.cookie(options.server.cookieToken, token, {
					httpOnly: true,
				}).redirect("/products");
			} else {
                res.send(`<div>credenciales invalidas, <a href="/login">Intente de nuevo</a></div>`);
			}
		} else {
            res.send(`<div>el usuario no está registrado, <a href="/signup">Registrarse</a></div>`);
		}
	} catch (error) {
		res.json({ status: "error", message: error.message });
	}
}

export const tokenLogoutController = (req,res)=>{
    req.logout(() => {
        res.clearCookie(options.server.cookieToken).json({status:"success", message:"sesion finalizada"});
    });
}