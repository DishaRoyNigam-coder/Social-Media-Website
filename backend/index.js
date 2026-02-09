import express from "express";
import cors from "cors";
import db from "./db.js";
import UserRouter from "./Routes/UserRoutes.js";

let app = express();

app.use(cors());
app.use(express.json());
app.use("/", UserRouter);

app.get("/", (req, res) => {
    res.send("This Is Home Endpoint");
})

app.listen(3000, () => {
    console.log("Server Is Started");
})