import { UserManagerMongo } from "../daos/managers/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js";
import jwt from "jsonwebtoken";
import { options } from "../config/options.js";
import { sendRecoveryPass } from "../utils/email.js";
import { generateEmailToken , verifyEmailToken, isValidPassword, createHash} from "../utils.js";
import { CartManagerMongo } from "../daos/managers/cartManagerMongo.js";
import { CartModel } from "../daos/models/cart.model.js";

const userManager = new UserManagerMongo(UserModel);
const cartManager = new CartManagerMongo(CartModel);

export const tokenSignupController = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const user = await userManager.getUserByEmail(email);
      if (!user) {
        let role = 'user';
        if (email.endsWith("@coder.com")) {
          role = "admin";
        }
        const newUser = {
          first_name,
          last_name,
          email,
          password: createHash(password),
          role,
          avatar: req.file.path
        };
        const userCreated = await userManager.addUser(newUser);
        // Crear el carrito para el usuario recién creado
        const cartAdded = await cartManager.addCart(userCreated._id);
        // Asignar el ID del carro al usuario utilizando el modelo UserModel
        await UserModel.findByIdAndUpdate(userCreated._id, { cart: cartAdded._id });
        // le asignamos un token al usuario
        const token = jwt.sign({ first_name: userCreated.first_name, last_name: userCreated.last_name, email: userCreated.email, role: userCreated.role,  _id: userCreated._id, avatar: userCreated.avatar },
          options.server.secretToken, { expiresIn: "24h" });

        console.log(cartAdded._id);
        // Configurar la cookie "cartId" con el ID del carrito y enviarla al cliente
        res.cookie("cartId", cartAdded._id, {
            httpOnly: true,
        });

        // Configurar la cookie de token y redirigir al cliente a "/products"
        res.cookie(options.server.cookieToken, token, {
          httpOnly: true,
        }).redirect("/products");
        
      } else {
        res.send(`<div>el usuario ya está registrado, <a href="/login">Loguearse</a></div>`);
      }
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
  

export const tokenLoginController = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userManager.getUserByEmail(email);
		if (user) {
			// validar contraseña
			if (isValidPassword(password, user)) {
				// generar el token para ese usuario; esta es la información que se va a guardar en el token
				const token = jwt.sign(
                    {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    _id: user._id
                },
                options.server.secretToken,{ expiresIn: "24h" });
				res.cookie(options.server.cookieToken, token, {
					httpOnly: true,
				}).redirect("/profile");
                console.log(user)
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
    // tuve que agregar el middleware en la ruta para obtener la inforamcion del usuario
    const user = {...req.user}
    //console.log(user)
    user.last_connection = new Date();
    req.logout(async () => {
        res.clearCookie(options.server.cookieToken).json({status:"success", message:"sesion finalizada"})
        const usedUpdated = await UserModel.findByIdAndUpdate(user._id, user);
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