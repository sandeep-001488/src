import {Router} from "./user.routes";
import {
    addComment,
    deleteComment,
    getVideoComment,
    updateComment
} from '../controllers/comment.controller'

import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComment).post(addComment);
router.use("/c/:commentId").delete(deleteComment).patch(updateComment);

export  default router