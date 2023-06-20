import { Router } from "express";
import { tokenSignupController, tokenLoginController, tokenLogoutController,forgotPasswordController, resetPasswordController} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", tokenSignupController)

router.post("/login", tokenLoginController);

router.post("/logout",tokenLogoutController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

export { router as authRouter };
