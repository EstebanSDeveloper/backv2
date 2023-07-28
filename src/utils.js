import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { options } from "./config/options.js";
import multer from "multer"

import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export {__dirname}

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const isValidPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password)
}

export const generateEmailToken = (email, expireTime) => {
    const token = jwt.sign({email}, options.gmail.emailToken, {expiresIn: expireTime})
    return token
}

export const verifyEmailToken = (token) => {
    try {
        const info = jwt.verify(token, options.gmail.emailToken)
        return info.email 
    } catch (error) {
        console.log(error.message)
        return null
    }
}

// revisar si todos los datos existen antes de subir la imagen
const validFields = (body) => {
    const {first_name,  email, password} = body
    if (!first_name || !email || !password) {
        return false
    } else {
        return true
    }
}

// filtro para validar los campos antes de cargar la imagen

const multerFilterProfile = (req, file , cb) => {
    const isValid = validFields(req.body)
    if (!isValid) {
        cb(null, false)
    } else {
        cb(null, true)
    }

}

// configuracion para guardar imagenes de usuarios 
const profileStorage = multer.diskStorage({
    // donde van a ir guardados los archivos
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, "/multer/users/images"))
    },
    // que nombre tendra el archivo que guardamos
    filename: function(req, file, cb) {
        cb(null, `${req.body.email}-profile-${file.originalname}`)
    }
})
 // creamos el uploader de multer
 export const uploaderProfile = multer({storage: profileStorage, fileFilter: multerFilterProfile})

 //---------------------------------------------------------------

 // configuracion para guardar documentos de usuarios 
const documentStorage = multer.diskStorage({
    // donde van a ir guardados los archivos
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, "/multer/users/documents"))
    },
    // que nombre tendra el archivo que guardamos
    filename: function(req, file, cb) {
        cb(null, `${req.user.email}-document-${file.originalname}`)
    }
})
 // creamos el uploader de multer
 export const uploaderDocument = multer({storage: documentStorage})

  //---------------------------------------------------------------

   // configuracion para guardar imagenes de productos 
const productStorage = multer.diskStorage({
    // donde van a ir guardados los archivos
    destination: function(req,file,cb){
        cb(null, path.join(__dirname, "/multer/products/images"))
    },
    // que nombre tendra el archivo que guardamos
    filename: function(req, file, cb) {
        cb(null, `${req.body.code}-image-${file.originalname}`)
    }
})
 // creamos el uploader de multer
 export const uploaderProducts = multer({storage: productStorage})

  //---------------------------------------------------------------

// ejemplo de como utilizar los uploaders en las rutas
// Router.post('/user', uploaderProfile.single('avatar'), (req, res) => {})

