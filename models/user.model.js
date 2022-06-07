import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

export default User