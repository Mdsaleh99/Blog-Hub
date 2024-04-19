import { Router } from "express";
import { test } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { updateUser, deleteUser, signOut } from "../controllers/user.controller.js";

const router = Router()

router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)
router.delete('/delete/:userId', verifyUser, deleteUser)
router.post('/signout', signOut)

export default router