import { Router } from "express";
import { test } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { updateUser, deleteUser } from "../controllers/user.controller.js";

const router = Router()

router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)
router.delete('/delete/:userId', verifyUser, deleteUser)

export default router