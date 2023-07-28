import { Router } from "express";
import { tokenSignupController, tokenLoginController, tokenLogoutController,forgotPasswordController, resetPasswordController} from "../controllers/auth.controller.js";
import passport from "passport";
import { uploaderProfile } from "../utils.js";

const router = Router();

router.post("/signup", uploaderProfile.single('avatar'),tokenSignupController)

router.post("/login", tokenLoginController);

router.post("/logout",passport.authenticate("authJWT", {session:false}),tokenLogoutController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

export { router as authRouter };
 
