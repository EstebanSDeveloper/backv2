import { Router } from "express";
import { mockProducts } from "../controllers/mock.controller.js";

const router = Router();

//ruta para la creación automática de 100 productos
router.get('/', mockProducts)

export {router as mocksRouter};


