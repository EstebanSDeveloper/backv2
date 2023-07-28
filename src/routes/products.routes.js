import { Router } from "express";
import { checkValidProductFields } from "../middlewares/validations.js";
import { getProductsController, getProductController, createProductController, updateProductController, deleteProductController } from "../controllers/products.controller.js";
import passport from "passport"
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

// ruta para obtener productos
router.get("/", getProductsController);
// ruta para obtener un producto por el id
router.get("/:pid", getProductController);
//ruta para agregar un producto
router.post("/", passport.authenticate("authJWT", {session:false}), checkRole(["admin","premium"]),checkValidProductFields, createProductController);
//ruta para actualizar un producto
router.put("/:pid", checkRole(["admin","premium"]), checkValidProductFields, updateProductController);
//ruta para eliminar el producto
router.delete("/:pid", passport.authenticate("authJWT", {session:false}), checkRole(["admin","premium"]), deleteProductController);


export {router as productsRouter};