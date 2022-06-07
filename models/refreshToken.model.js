import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {timestamps: true});

RefreshTokenSchema.statics.createRefreshToken = async function (user) {
    const refreshToken = await jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1day'
    });
    const _object = new this({
        token: refreshToken,
        user: user._id
    });
    const refreshTokenDocument = await _object.save();
    return refreshTokenDocument._doc.token;
};

const RefreshToken = mongoose.model("Refresh_Token", RefreshTokenSchema);

export default RefreshToken;