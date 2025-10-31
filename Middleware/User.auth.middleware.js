import jwt from 'jsonwebtoken'
import User from '../Models/User.Schema.js'
import dotenv from 'dotenv'
dotenv.config()


const userAuthMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] // split(' ') bearer [1]
    if (!token) {
        return res.status(401).json({ message: "token is missing" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next()
    } catch (error) {
        res.status(500).json({ message: "invalid token, internal server error" })
    }
}
export default userAuthMiddleware