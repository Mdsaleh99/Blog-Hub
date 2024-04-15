import { Router } from "express"
import { signUp, signIn, google } from "../controllers/auth.controller.js"
const router = Router()

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/google', google)


export default router