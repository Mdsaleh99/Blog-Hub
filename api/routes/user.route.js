import { Router } from "express";
import { test } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { updateUser } from "../controllers/user.controller.js";

const router = Router()

router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)

export default router