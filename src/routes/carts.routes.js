import {Router} from "express";
import { checkAuthentication } from "../middlewares/checkAuthentication.js";
import { productsInCartController,addProductToCartController, deleteProductFromCartController,
    updateProductsInCartController, updateProductQuantityInCartController, updateProductQuantityInCartController2,
    deleteProductsInCartController, getCarts,purchaseCartController, deleteCartController } from "../controllers/cart.controller.js";
import passport from "passport"
const router = Router();

// ver los carritos creados
router.get("/", getCarts)

//agregar carrito
//router.post("/", addCartController);

// eliminar carrito por ID
router.delete("/delete/:id", deleteCartController);

//ruta para listar todos los productos de un carrito
router.get("/:cid" ,productsInCartController);

//ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", passport.authenticate("authJWT", {session:false}),checkAuthentication, addProductToCartController);

//ruta para eliminar un producto del carrito
router.delete("/:cid/product/:pid", deleteProductFromCartController);

//ruta para actualizar todos los productos de un carrito.
router.put("/:cid", updateProductsInCartController);

//ruta para actualizar cantidad de un producto en el carrito
router.put("/:cid", updateProductQuantityInCartController);

//ruta para actualizar la cantidad de un producto en el carrito
router.put("/:cid/product/:pid",updateProductQuantityInCartController2);

//ruta para eliminar todos los productos del carrito
router.delete("/:cid",deleteProductsInCartController);

//finalizar la compra
router.post("/:cid/purchase", passport.authenticate("authJWT", {session:false}),purchaseCartController);

export {router as cartsRouter};