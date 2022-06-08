import bcrypt from "bcrypt";
import {RefreshToken, User} from "../models/index.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
    const {username, email, password, roles} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({username, email, password: passwordHash, roles});
    await user.save();
    res.send({message: "User was registered successfully!"});
}

const signin = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username}).populate('roles');
    const passwordIsValid = await bcrypt.compare(password, user._doc.password);

    if (passwordIsValid) {
        const accessToken = await jwt.sign(user._doc, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15min'
        });
        const refreshToken = await RefreshToken.createRefreshToken(user._doc);
        return res.send({
            user: {
                _id: user._id, user: user._doc.username, email: user._doc.email, roles: user._doc.roles,
            }, accessToken, refreshToken
        });
    }
    res.status(401).send({accessToken: null, message: "Invalid Password!"});
}

const regenerateToken = async (req, res) => {
    try {
        const {refreshToken} = req.body;
        if (refreshToken == null) throw new Error("Refresh Token is required!")

        let result = await RefreshToken.findOne({token: refreshToken}).populate({
            path: 'user', populate: [{path: 'roles'},]
        });
        if (!result) throw new Error("Refresh token is not in database!")

        try {
            jwt.verify(result._doc.token, process.env.REFRESH_TOKEN_SECRET)
        } catch (err) {
            await RefreshToken.findByIdAndRemove(result._id, {useFindAndModify: false});
            throw new Error("Refresh token was expired. Please make a new signin request")
        }

        const accessToken = await jwt.sign(result._doc.user._doc, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15min'
        });

        res.status(200).json({accessToken, refreshToken: result._doc.token});
    } catch (e) {
        res.status(403).json({message: e.message});
    }
}

export {
    signup, signin, regenerateToken
}