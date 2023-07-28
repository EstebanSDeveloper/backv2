import {Router} from "express"
import { checkRole } from "../middlewares/checkRole.js"
import passport from "passport"
import { uploaderDocument } from "../utils.js"
import { checkAuthentication } from "../middlewares/checkAuthentication.js"
import { updateUserToPremium } from "../controllers/users.controller.js"
import { uploadDocuments } from "../controllers/users.controller.js"

const router = Router()

router.put('/premium/:uid', passport.authenticate("authJWT", {session:false}), checkRole(["admin"]), updateUserToPremium)

router.put("/:uid/documents", passport.authenticate("authJWT", {session:false}),checkAuthentication, uploaderDocument.fields([
    {name: "identificacion", maxCount:1},
    {name: "domicilio", maxCount:1},
    {name: "estadoDeCuenta", maxCount:1}
    ]), uploadDocuments)

export {router as usersRouter}
