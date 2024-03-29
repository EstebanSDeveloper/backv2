import { UserModel } from "../daos/models/user.model.js";
import { UserManagerMongo} from '../daos/managers/userManagerMongo.js'

//servicio
const userManager = new UserManagerMongo(UserModel)

export const updateUserToPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        // verificar si el usuario si existe en la base de datos
        const user = await UserModel.findById(userId)
        const userRol = user.role
        // validar si el usuario tiene status de complete, para ascenderlo de rol a premium
        if (user.documents.length < 3 && user.status !== "complete") {
            return res.json({status: "error", message: "You must upload all the documents to be a premium user."})
        }
        // cambio de roles si si existen los usuarios y si cumple con el status 
        if (userRol === "user"){
            user.role = "premium"
        } else if (userRol === "premium"){
            user.role = "user"
        } else {
            return res.json({status:"error", message: "no es posible cambiar el rol del usuario"})
        }
        await UserModel.updateOne({_id:user._id}, user)
        res.send({status: "success", message:"rol modificado", payload: {user}})
    } catch (error) {
        console.log(error.message)
        res.json({ error: error, message: "Hubo un error al cambiar el rol del usuario."})
    }
}

export const uploadDocuments = async (req, res) => {
    try {
        const userId= req.params.uid;
        const user = await UserModel.findById(userId)
        if (user) {
            console.log(req.files)
            // Verificacion, si el usuario me envió un arreglo con el objeto (ese objeto seria el 0 ya que solo admite de a un archivo)
            // si si lo envio toma el objeto y si no queda en null
            const identificacion = req.files['identificacion']?.[0] || null;
            const domicilio = req.files['domicilio']?.[0] || null;
            const estadoDeCuenta = req.files['estadoDeCuenta']?.[0] || null;
            const docs = []
            if (identificacion) {
                docs.push({name: "identificacion", referencia: identificacion.filename})
            }
            if (domicilio) {
                docs.push({name: "domicilio", referencia: domicilio.filename})
            }
            if (estadoDeCuenta) {
                docs.push({name: "estadoDeCuenta", referencia: estadoDeCuenta.filename})
            }
            if (docs.length === 3) {
                user.status = "complete"
            } else {
                user.status = "incomplete"
            }
            user.documents = docs
            const userUpdated = await UserModel.findByIdAndUpdate(user._id, user)
            res.json({ status: "success", message: "Documentos subidos correctamente"})

            // // re nombramiento de documentos
            // const docs = req.files.map(doc =>({name:doc.originalname, reference: doc.filename}))
            // user.documents = docs
            // // actualizar la propiedad status ya que los documentos estan completos
            // user.status = "complete"
            // // actualizacion de usuario con los documentos
            // const userUpdated = await UserModel.findByIdAndUpdate(user._id, user)
            // console.log(docs)
            // res.json({ status: "success", message: "Documentos subidos correctamente"})
        } else {
            res.json({ error: error, message: "No se encontró usuario con ese Id"})
        }
    } catch (error) {
        res.json({ error: error, message: "Hubo un error al cargar los documentos"})
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await userManager.getUsers()
        res.json({status:"success", result:users, message:"This are the Users"})
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const deleteNotConnectedUser = async (req, res) => {
    try {
        const users = await userManager.deleteNotConnected()
        res.json({status:"success", result:users, message:"This users have been deleted for innactivity over 30 days."})
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const userId= req.params.uid;
        const user = await UserModel.findById(userId)
        if (user) {
            const userDeleted = await userManager.deleteUser(userId);
            return res.json({ status: "success",  message: "El siguiente usuario ha sido eliminado", payload: userDeleted  })
        }
    } catch (error) {
        res.status(400).json({ message: error });
    }

}

// Controlador para obtener los datos del usuario autenticado
export const userCartController = async (req, res) => {
    try {
      const userId = req.user._id; // Aquí puedes obtener el ID del usuario directamente desde req.user
      const user = await UserModel.findById(userId).populate("cart");
      if (user) {
        const cartId = user.cart._id; // Obtener el cartId del usuario
        console.log(cartId); // Aquí puedes ver el cartId en el servidor (opcional)
  
        // Enviar los datos del usuario (incluido el cartId) como respuesta JSON
        res.json({ cart: cartId });
      } else {
        console.log("Usuario no encontrado");
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener los datos del usuario" });
    }
  };
  
