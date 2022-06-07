import User from "../models/user.model.js";

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if (user) {
            res.status(400).send({message: "Failed! Username is already in use!"});
            return;
        }
    } catch (e) {
        res.status(500).send({message: e.message});
        return;
    }

    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (user) {
            res.status(400).send({message: "Failed! Email is already in use!"});
            return;
        }
    } catch (e) {
        res.status(500).send({message: e.message});
        return;
    }
    next();
};

export {checkDuplicateUsernameOrEmail}