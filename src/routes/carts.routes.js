import {Router} from "express";
import { addCartController, productsInCartController,addProductToCartController, deleteProductFromCartController,
    updateProductsInCartController, updateProductQuantityInCartController, updateProductQuantityInCartController2,
    deleteProductsInCartController } from "../controllers/cart.controller.js";

const router = Router();

//agregar carrito
router.post("/", addCartController);

//ruta para listar todos los productos de un carrito
router.get("/:cid" ,productsInCartController);

//ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", addProductToCartController);

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

export {router as cartsRouter};