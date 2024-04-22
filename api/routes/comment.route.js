import express from 'express';
import {
  createComment,
  getPostComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { verifyUser } from '../utils/verifyUser.js';



const router = express.Router();

router.post('/create', verifyUser, createComment)
router.get('/getpostcomments/:postId', getPostComments)
router.put('/likecomment/:commentId', verifyUser, likeComment)
router.put('/editcomment/:commentId', verifyUser, editComment)
router.delete('/deletecomment/:commentId', verifyUser, deleteComment)
router.get('/getcomments', verifyUser, getComments)

export default router;