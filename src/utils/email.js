import nodemailer from "nodemailer"
import { options } from "../config/options.js"

// creacion de transporte 
const transporter = nodemailer.createTransport({
    service:"gmail",
    port: 587,
    auth:{
        user:options.gmail.emailAdmin,
        pass:options.gmail.emailPass
    },
    secure: false,
    tls:{
        rejectUnauthorized: false
    }
})

// funcion para generar el correo de recuperacion de la contraseña

export const sendRecoveryPass = async(userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}` // enlace con el token 
    //estructura del correo 
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "reestablecer contraseña",
        html: `
            <div>
                <h2>Has solicitado un cambio de contraseña</h2>
                <p>Da click en el siguiente enlace para recuperar tu contraseña</p>
                <a href="${link}">
                <button>Restablecer contraseña</button></a>
            </div>
        `
    })
}