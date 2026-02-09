import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../Models/UserModel.js";
dotenv.config();

let createToken = (userPayload) => {
    return jwt.sign(userPayload, process.env.SECRET_KEY, { expiresIn: "1h" });
}

async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send("Unauthorized");

        const payload = jwt.verify(token, process.env.SECRET_KEY);

        const user = await UserModel.findById(payload.id);
        if (!user) return res.status(401).send("Unauthorized");

        req.userPayload = user;
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }
}


export { createToken, verifyToken };