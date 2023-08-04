import { CartManagerMongo } from "../daos/managers/cartManagerMongo.js";
import { ProductManagerMongo } from "../daos/managers/productManagerMongo.js";
import { CartModel } from "../daos/models/cart.model.js";
import { ProductModel } from "../daos/models/product.model.js";
import { TicketModel } from "../daos/models/ticket.model.js";
import {v4 as uuidv4} from 'uuid';

//servicio
const cartManager = new CartManagerMongo(CartModel);
const productManager = new ProductManagerMongo(ProductModel);

export const getCarts = async(req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.json({status:"success", result:carts, message:"This are the carts"})
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}

// export const addCartController = async(req,res)=>{
//     try {
//         const cartAdded = await cartManager.addCart();
//         res.json({status:"success", result:cartAdded, message:"cart created"});
//     } catch (error) {
//         res.status(400).json({status:"error", error:error.message});
//     }
// }
  

export const deleteCartController = async(req, res) => {
    try {
      const cartId = req.params.id;
      const response = await cartManager.deleteCart(cartId);
      res.json({ status: "success", result: response, message: "cart deleted" });
    } catch (error) {
      res.status(400).json({ status: "error", error: error.message });
    }
  };
  

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
        //console.log("cart: ", cart);
        const product = await productManager.getProductById(productId);
        //console.log("product: ", product);
        const cartUpdated = await cartManager.addProductToCart(cartId, productId);

        res.json({status:"success", result:cartUpdated, message:"Product added to cart successfully"});
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
        const cart = await cartManager.getCartById(cartId);
        const product = await productManager.getProductById(productId);
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


export const purchaseCartController =async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            // verificamos si existen productos en el carrito
            if(!cart.products.length){
               return req.send("es necesario que agregues un producto antes de realizar la compra")
            }
            // Hago dos arreglos con los productos comprados en el carrito y los productos existentes en el stock
            const ticketProducts = []
            const rejectedProducts = []
            let totalPrice = 0; // Variable para almacenar el total de precios

            for(let i=0; i<cart.products.length;i++){
                const cartProduct = cart.products[i];
                // obtenemos la informacion de los productos que están en el carrito, los detalles
                const productDB = await productManager.getProductById(cartProduct.id._id);
                // comparar la cantidad de ese producto en el carrito con el stock del producto
                if(cartProduct.quantity<=productDB.stock){
                    ticketProducts.push(cartProduct);
                    totalPrice += productDB.price * cartProduct.quantity; // Sumar el precio del producto al total
                     
                    // Restar la cantidad del producto en el ticket del stock del producto
                    const updatedStock = productDB.stock - cartProduct.quantity;
                    await productManager.updateProduct(productDB._id, { stock: updatedStock });
                
                } else {
                    rejectedProducts.push(cartProduct);
                }
            }
            console.log("ticketProducts",ticketProducts)
            console.log("rejectedProducts",rejectedProducts)
            const purchaseDatetime = new Date().toLocaleString(); // Obtener la fecha y hora actual como una cadena formateada
            const newTicket = {
                code:uuidv4(),
                //purchase_datetime: new Date(purchaseDatetime), // Convertir la cadena formateada en un objeto Date
                amount: totalPrice, // Asignar el total de precios al campo amount del ticket
                purchaser: req.user.email
            }
            const ticketCreated = await TicketModel.create(newTicket);
            res.json({status:"success", result: ticketCreated, message:"Ticket created successfully"})
        } else {
            res.send("El carrito no existe")
        }
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
}
