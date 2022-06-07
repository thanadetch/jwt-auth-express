import express from "express";
import {checkDuplicateUsernameOrEmail} from "../middleware/verifySignUp.js";
import {regenerateToken, signin, signup} from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', checkDuplicateUsernameOrEmail, signup)
router.post('/signin', signin)
router.post('/regenerateToken', regenerateToken)

const authRouter = router;
export default authRouter;