import {ProductManagerMongo} from "../daos/managers/productManagerMongo.js";
import {ProductModel} from "../daos/models/product.model.js";
import { CartManagerMongo } from "../daos/managers/cartManagerMongo.js";
import { CartModel } from "../daos/models/cart.model.js";
import { UserManagerMongo } from "../daos/managers/userManagerMongo.js";
import { UserModel } from "../daos/models/user.model.js"

const productManager = new ProductManagerMongo(ProductModel);
const cartManager = new CartManagerMongo(CartModel);
const userManager = new UserManagerMongo(UserModel)

export const renderChat = (req,res)=>{
    res.render("chat");
}

export const renderProducts = async(req,res)=>{
    console.log(req.user)
    try {
        const first_name_User = req.user.first_name;
        const last_name_User = req.user.last_name
        const {limit = 10,page=1,category,stock,sort="asc"} = req.query;
        const stockValue = stock==0 ? undefined : parseInt(stock);
        if(!["asc","desc"].includes(sort)){
            return res.json({status:"error", mesage:"orden no valido"});
        };
        const sortValue= sort === "asc" ? 1 : -1;
        // console.log('limit: ', limit, "page: ", page,"category: ", category, "stockValue: ", stockValue, "sortValue: ", sortValue);
        let query={};
        if (category && stockValue) {
            query = { category: category, stock: {$gte:stockValue} };
        } else {
            if (category || stockValue) {
                if (category) {
                  query = { category: category };
                } else {
                  query = { stock: {$gte:stockValue} };
                }
            }
        };
        // console.log("query: ", query);
        const result = await productManager.getPaginateProducts(
            query,
            {
                page,
                limit,
                sort:{price:sortValue},
                lean:true,
            }
        );
        // console.log("result: ", result);
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
        const data ={
            name: `${first_name_User} ${last_name_User}`,
            status:"success",
            payload: result.docs,
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` : null,
            nextLink: result.hasNextPage ? baseUrl.includes("page") ?
            baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) :baseUrl.concat(`?page=${result.nextPage}`) : null
        };
        res.render("products", data);
    } catch (error) {
        // console.log(error.message);
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
}

export const renderProduct = async(req,res)=>{
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        // console.log("product: ", product);
        res.render("productDetail",product);
    } catch (error) {
        // console.log(error.message);
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
}

export const renderCart = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        // console.log("cart:", cart)
        res.render("cartDetail",cart);
    } catch (error) {
        // console.log(error.message);
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
}

export const renderSignup = (req,res)=>{
    res.render("signup");
}

export const renderLogin = (req,res)=>{
    res.render("login");    
}   
    
export const renderProfile = async (req, res) => {
    const user = req.user;
    res.render("profile", { user });
};

export const purchase = (req, res) => {
    const user = req.user;
    res.render("purchase", { user });
}


export const renderForgotPassword = (req, res) => {
    res.render("forgotPassword")
}

export const renderResetPassword = (req, res) => {
    // extraer el token de la ruta 
    const token = req.query.token
    res.render("resetPassword", {token})
}

export const renderAdmin = async (req, res) => {
    try {
        const user = req.user;
        // obtener lista de usuarios
        const users = await userManager.getUsersAdmin() 

        // Convertir el campo "avatar" de cada usuario a una URL en base64 antes de renderizar la vista
        users.forEach(user => {
            if (user.avatar && user.avatar instanceof Buffer) {
                const avatarType = user.avatar.contentType === 'image/jpeg' ? 'jpeg' : 'png';
                const avatarBase64 = user.avatar.toString('base64');
                user.avatar = `data:image/${avatarType};base64,${avatarBase64}`;
            }
    });

        res.render("admin", { user, users })
    } catch (error) {
        res.send(`<div>Hubo un error al cargar esta vista</div>`);
    }
    
}