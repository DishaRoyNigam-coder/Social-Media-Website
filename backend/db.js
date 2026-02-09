import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

let db = mongoose.connection;

db.on("connected", () => {
    console.log("Database Connected Successfully");
})

db.on("disconnect", () => {
    console.log("Database Disconnected");
})

export default db;