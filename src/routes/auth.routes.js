import { Router } from "express";
import { tokenSignupController, tokenLoginController, tokenLogoutController} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", tokenSignupController)

router.post("/login", tokenLoginController);

router.post("/logout",tokenLogoutController);

export { router as authRouter };
