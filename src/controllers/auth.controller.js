import { UserManagerMongo } from "../daos/managers/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";
import { sendRecoveryPass } from "../utils/email.js";
import { generateEmailToken , verifyEmailToken, isValidPassword, createHash} from "../utils.js";

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
				}).redirect("/profile");
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

export const forgotPasswordController = async (req,res)=>{
    try {
        //recibinmos el correo de forgot password handlebars
        const {email} =req.body
        //verificamos que el usuario exista
        const user = await userManager.getUserByEmail(email);
        if (!user) {
          return res.send(`<div>Error, <a href='/forgot-password'>Intente nuevamente </a></div>`)
        } 
        // si si existe, generamos el token del enlace
        const token = generateEmailToken(email,3*60)
        await sendRecoveryPass(email, token)
        res.send(
            `Se ha enviado un correo de recuperación para reestablecer la contraseña de su cuenta. <a href='/login'>Vuelve al login</a>`)
    } catch (error) {
        res.send(`<div>Error, <a href='/forgot-password'>Intente nuevamente </a></div>`)
    }
}

export const resetPasswordController = async (req,res) => {
    try {
        const token = req.query.token
        const {email, newPassword} = req.body
        // validamos que el token aún sea válido, por el tiempo 
        const validEmail = verifyEmailToken(token)
        if (!validEmail) {
            return res.send(`El enlace ya no es valido, genere un nuevo enlace para recuperación de contraseña <a href='/forgot-password'>Recuperar contraseña</a>`)
        } 
        const user = await userManager.getUserByEmail(email);
        if (isValidPassword(newPassword, user)) {
            return res.send("No puedes usar la misma contraseña")
        }
        const userData = {
            ...user._doc,
            password: createHash(newPassword)
        }
        const userUpdate = await UserModel.findOneAndUpdate({email:email}, userData)
        res.render('login', {message: "La contraseña ha sido actualizada, intente ingresar nuevamente"} )
    } catch (error) {
        res.send(error.message)
    }
}