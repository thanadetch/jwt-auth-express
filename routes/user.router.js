import express from "express";
import {authorizeAdmin} from "../middleware/authen.js";

const router = express.Router();

router.get('/check/admin', authorizeAdmin, (req, res, next) => {
    return res.json({message: "You're admin!"});
});

const userRouter = router;
export default userRouter;
