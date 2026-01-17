import { UserModel } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SECRET = "SDSDSDSDDS";
export const userSignInMiddlware = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ msg: "email and password required" });
        }
        const User = await UserModel.findOne({ email: email });
        if (!User || !User.password) {
            return res.status(401).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (isMatch) {
            req.userInfo = User;
            next();
        }
        else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (err) {
        console.log(err);
    }
};
export const UserBrainMiddlware = async (req, res, next) => {
    try {
        const { email, password } = req.cookies.token;
        if (!email || !password) {
            return res.status(401).json({ msg: "email and password required" });
        }
        const User = await UserModel.findOne({ email: email });
        if (!User || !User.password) {
            return res.status(401).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, User.password);
        if (isMatch) {
            req.userInfo = User;
            next();
        }
        else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (err) {
        console.log(err);
    }
};
export const createBrain = (req, res, next) => {
    console.log(req.cookies);
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ msg: "Signin first" });
    }
    try {
        const decoded = jwt.verify(token, SECRET);
        req.UserId = decoded.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
};
//# sourceMappingURL=signinMiddleware.js.map