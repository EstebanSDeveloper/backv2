import  {__dirname}  from "../utils.js";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./options.js";
import path from 'path'

const PORT = options.server.port

// crear las definiciones de swagger para la documentacion 
const swaggerOptions = {
    definition:{
        openapi:"3.0.1",
        info:{
            title: "Documentation for app e-commerce",
            version:"1.0.0",
            description:"Api rest to full management of an E-commerce Backend",
        },
        servers:[{url:`http://localhost:${PORT}`},{url:`http://localhost:2020`}], // servidores que vamos a documentar
    },
    apis:[`${path.join(__dirname,"/docs/**/*.yaml")}`], //archivos que contienen la documentacion de las rutas
}

export const swaggerSpecs = swaggerJsDoc(swaggerOptions)
