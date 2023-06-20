import {Router} from "express";
import { renderChat, renderProducts,renderProduct, renderCart, renderProfile, renderSignup, renderLogin, renderForgotPassword, renderResetPassword} from "../controllers/web.controller.js";
import passport from "passport"
import { checkAuthentication } from "../middlewares/checkAuthentication.js";

const router = Router();

router.get("/",renderChat);

router.get("/products", passport.authenticate("authJWT", {session:false}),checkAuthentication, renderProducts);

router.get("/products/:pid", renderProduct);

router.get("/cart/:cid", renderCart);

//rutas vistas autenticacion
router.get("/signup", renderSignup);

router.get("/login", renderLogin);

router.get("/forgot-password", renderForgotPassword); 

router.get("/reset-password", renderResetPassword);

router.get("/profile", passport.authenticate("authJWT", { session: false }), renderProfile); 

export {router as webRouter}