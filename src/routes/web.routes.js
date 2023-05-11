import {Router} from "express";
import { renderChat, renderProducts,renderProduct, renderCart, renderSignup, renderLogin, renderCurrent} from "../controllers/web.controller.js";
import passport from "passport"

const router = Router();

router.get("/",renderChat);

router.get("/products", passport.authenticate("authJWT", {session:false}),renderProducts);

router.get("/products/:pid", renderProduct);

router.get("/cart/:cid", renderCart);

//rutas vistas autenticacion
router.get("/signup", renderSignup);

router.get("/login", renderLogin);

router.get("/current",passport.authenticate("authJWT", {session:false}),renderCurrent)

export {router as webRouter}