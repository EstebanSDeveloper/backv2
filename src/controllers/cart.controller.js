import { CartManagerMongo } from "../daos/managers/cartManagerMongo.js";
import { ProductManagerMongo } from "../daos/managers/productManagerMongo.js";
import { CartModel } from "../daos/models/cart.model.js";
import { ProductModel } from "../daos/models/product.model.js";

//servicio
const cartManager = new CartManagerMongo(CartModel);
const productManager = new ProductManagerMongo(ProductModel);

export const addCartController = async(req,res)=>{
    try {
        const cartAdded = await cartManager.addCart();
        res.json({status:"success", result:cartAdded, message:"cart added"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const productsInCartController = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        //obtenemos el carrito
        const cart = await cartManager.getCartById(cartId);
        res.json({status:"success", result:cart});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const addProductToCartController = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);
        // console.log("cart: ", cart);
        const product = await productManager.getProductById(productId);
        // console.log("product: ", product);
        const cartUpdated = await cartManager.addProductToCart(cartId, productId);
        res.json({status:"success", result:cartUpdated, message:"product added"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const deleteProductFromCartController = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);
        // console.log("cart: ", cart);
        const product = await productManager.getProductById(productId);
        // // console.log("product: ", product);
        const response = await cartManager.deleteProduct(cartId, productId);
        res.json({status:"success", result:response, message:"product deleted"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const updateProductsInCartController = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartManager.getCartById(cartId);
        cart.products = [...products];
        const response = await cartManager.updateCart(cartId, cart);
        res.json({status:"success", result:response, message:"cart updated"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const updateProductQuantityInCartController = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartManager.getCartById(cartId);
        cart.products = [...products];
        const response = await cartManager.updateCart(cartId, cart);
        res.json({status:"success", result:response, message:"cart updated"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const updateProductQuantityInCartController2 = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        await cartManager.getCartById(cartId);
        await productManager.getProductById(productId);
        const response = await cartManager.updateQuantityInCart(cartId, productId, quantity);
        res.json({status:"success", result: response, message:"producto actualizado"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

export const deleteProductsInCartController = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        cart.products=[];
        const response = await cartManager.updateCart(cartId, cart);
        res.json({status:"success", result: response, message:"productos eliminados"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}