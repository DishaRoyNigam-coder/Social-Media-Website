import express from "express";
import UserModel from "../Models/UserModel.js";
import { createToken } from "../jwt/jwt.js";
import nodemailer from "nodemailer";
import { otpStore } from "../OTP/otpStore.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

let Router = express.Router();

Router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    // check username
    const usernameExist = await UserModel.findOne({ username });
    if (usernameExist) {
        return res.send({ status: false, msg: "Username already exists" });
    }

    // check email (FIX: use findOne)
    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
        return res.send({ status: false, msg: "Email already exists" });
    }

    // create user
    const user = new UserModel({ username, email, password });
    await user.save();

    const tokenUser = {
        username,
        email,
        id: user._id,
    };

    const token = createToken(tokenUser);

    // console.log("User Created Successfully");
    res.send({
        status: true,
        msg: "User Created Successfully",
        token,
    });
});

Router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // check user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.send({ status: false, msg: "Invalid email or password" });
    }

    // check password
    if (user.password !== password) {
        return res.send({ status: false, msg: "Invalid email or password" });
    }

    const tokenUser = {
        username: user.username,
        email: user.email,
        id: user._id,
    };

    const token = createToken(tokenUser);

    res.send({
        status: true,
        msg: "Login successful",
        token,
    });
});

let sendMail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from: `"Auth App" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
      <h2>Your OTP Code</h2>
      <p><b>${otp}</b></p>
      <p>This code expires in 5 minutes.</p>
    `,
    });
}

Router.post("/send-otp", async (req, res) => {
    let { email } = req.body;

    const otp = crypto.randomInt(1000, 10000).toString();

    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
    })

    await sendMail(email, otp);

    res.json({
        status: true,
        msg: "OTP sent successfully",
    });
})

Router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);

    if (!stored) {
        return res.json({ status: false, msg: "OTP not found" });
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return res.json({ status: false, msg: "OTP expired" });
    }

    if (stored.otp !== otp) {
        return res.json({ status: false, msg: "Invalid OTP" });
    }

    stored.verified = true;

    res.json({
        status: true,
        msg: "OTP verified successfully",
    });
});

Router.post("/update-password", async (req, res) => {
    const { email, newPassword } = req.body;

    const stored = otpStore.get(email);

    if (!stored || !stored.verified) {
        return res.json({
            status: false,
            msg: "OTP verification required",
        });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.json({
            status: false,
            msg: "User not found",
        });
    }

    user.password = newPassword; // ⚠️ Hash later (bcrypt)
    await user.save();

    // 🧹 Clean OTP
    otpStore.delete(email);

    res.json({
        status: true,
        msg: "Password updated successfully",
    });
});


export default Router;