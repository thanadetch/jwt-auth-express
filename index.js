import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.router.js";

dotenv.config();

const {PORT: port, DB_URL: dbUrl} = process.env;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/user', userRouter);
app.use('/auth', authRouter);

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    if (!error) {
        console.log("Successfully connect to MongoDB.");

        app.listen(port, async () => {
            console.log(`Server is running at https://localhost:${port}`);
        });
    } else {
        console.error("Connection error", error);
    }
});
