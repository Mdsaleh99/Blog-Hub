import { Router } from "express";
import { test } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { updateUser, deleteUser, signOut } from "../controllers/user.controller.js";

const router = Router()

router.get('/test', test)
router.put('/update/:userId', verifyUser, updateUser)  // here userId is related to the sign in mongodb id of the user and both are same
router.delete('/delete/:userId', verifyUser, deleteUser) // here userId is related to the sign in mongodb id of the user 
router.post('/signout', signOut)

export default router