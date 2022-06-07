import jwt from "jsonwebtoken";

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({message: 'Unauthorized'})

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user
        next()
    } catch (e) {
        res.status(403).json(e)
    }
}

const authorizeAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({message: 'Unauthorized'})

    try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!user.roles.some(role => role.name === 'admin')) {
            return res.status(401).json({message: "Unauthorized! You aren't the admin."});
        }
        req.user = user
        next()
    } catch (e) {
        res.status(403).json(e)
    }
}

export {authenticationToken, authorizeAdmin}

