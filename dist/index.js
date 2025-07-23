"use strict";
// import express from "express";
// import mongoose from "mongoose";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import jwt from "jsonwebtoken";
// import { ContentModel, LinkModel, UserModel } from "./db";
// import { JWT_PASSWORD } from "./config";
// import { userMiddleware } from "./middleware";
// import { random } from "./utlis";
// import cors from "cors";
// const app = express();
// mongoose.connect("mongodb://localhost:27017/brainly");
// app.use(express.json());
// app.use(cors());
// app.post("/api/v1/signup",async(req,res)=>{
//     // Zod validation, hash the password
//     const username  = req.body.username;
//     const password = req.body.password;
//     try{
//         await UserModel.create({
//         username:username,
//         password:password
//         })
//         res.json({
//             message:"User Signed Up"
//         })
//     } catch(e){
//         res.status(411).json({
//             message : "User already exits"
//         })
//     }
// })
// app.post("/api/v1/signin", async(req,res)=>{
//     const username = req.body.username;
//     const password = req.body.password;
//     const existingUser = await UserModel.findOne({
//         username,
//         password
//     })
//     if(existingUser){
//         const token = jwt.sign({
//             id:existingUser._id
//         },JWT_PASSWORD)
//         res.json({
//             token
//         })
//     }
//     else{
//         res.status(403).json({
//             message: "Incorrect credentials"
//         })
//     }
// })
// app.post("/api/v1/content",userMiddleware,async(req,res)=>{
//     const link = req.body.link;
//     const type = req.body.type;
//     await ContentModel.create({
//         link,
//         type,
//         title:req.body.title,
//         // @ts-ignore
//         userId:req.userId,
//         tags:[]
//     })
//     return res.json({
//         message:"Content added"
//     })
// })
// app.get("/api/v1/content",userMiddleware,async(req,res)=>{
//     //@ts-ignore
//     const userId = req.userId;
//     const content = await ContentModel.find({
//         userId:userId
//     }).populate("userId","username")  //through this we get user id,name,password and after select we only get what we select like here i am selecting username so i only got username
//     res.json({
//         content
//     })
// })
// app.delete("/api/v1/content",userMiddleware, async(req,res)=>{
//     const contentId = req.body.contentId;
//     await ContentModel.deleteMany({
//         contentId,
//         // @ts-ignore
//         userId : req.userId
//     })
//     res.json({
//         message:"Deleted"
//     })
// })
// app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
//     const share = req.body.share;
//     if (share) {
//         const existingLink = await LinkModel.findOne({
//             //  @ts-ignore
//             userId : req.userId
//         })
//         if(existingLink){
//             res.json({
//                 hash:existingLink.hash
//             });
//             return;
//         }
//         const hash = random(10);
//         await LinkModel.create({
//              //  @ts-ignore 
//             userId: req.userId,
//             hash: hash
//         });
//         res.json({
//             hash
//         });
//     } else {
//         await LinkModel.deleteOne({
//             //  @ts-ignore
//             userId: req.userId
//         });
//         res.json({
//             message: "Removed link"
//         });
//     }
// });
// app.get("/api/v1/brain/:shareLink", async(req,res)=>{
//     const hash = req.params.shareLink;
//     const link = await LinkModel.findOne({
//         hash
//     });
//     if(!link){
//         res.status(411).json({
//             message:"Sorry incorrect input"
//         })
//         return;
//     }
//      // userId
//     const content = await ContentModel.find({
//         userId : link.userId
//     })
//     const user = await UserModel.findOne({
//         _id : link.userId
//     })
//     if(!user){
//         res.status(411).json({
//             message:"user not found, error should ideally not happen"
//         })
//         return;
//     }
//     res.json({
//         username:user.username,
//         content:content
//     })
// })
// app.listen(3000);
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utlis_1 = require("./utlis");
// Load .env variables
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default.connect(config_1.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        yield db_1.UserModel.create({ username, password });
        res.json({ message: "User Signed Up" });
    }
    catch (e) {
        res.status(411).json({ message: "User already exists" });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const existingUser = yield db_1.UserModel.findOne({ username, password });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_PASSWORD);
        res.json({ token });
    }
    else {
        res.status(403).json({ message: "Incorrect credentials" });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    yield db_1.ContentModel.create({
        link,
        type,
        title,
        // @ts-ignore
        userId: req.userId,
        tags: [],
    });
    res.json({ message: "Content added" });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const content = yield db_1.ContentModel.find({ userId }).populate("userId", "username");
    res.json({ content });
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.body;
    yield db_1.ContentModel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId,
    });
    res.json({ message: "Deleted" });
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({
            // @ts-ignore
            userId: req.userId,
        });
        if (existingLink) {
            return res.json({ hash: existingLink.hash });
        }
        const hash = (0, utlis_1.random)(10);
        yield db_1.LinkModel.create({
            // @ts-ignore
            userId: req.userId,
            hash,
        });
        res.json({ hash });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            // @ts-ignore
            userId: req.userId,
        });
        res.json({ message: "Removed link" });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({ hash });
    if (!link) {
        return res.status(411).json({ message: "Sorry incorrect input" });
    }
    const content = yield db_1.ContentModel.find({ userId: link.userId });
    const user = yield db_1.UserModel.findOne({ _id: link.userId });
    if (!user) {
        return res.status(411).json({ message: "User not found" });
    }
    res.json({
        username: user.username,
        content,
    });
}));
app.listen(config_1.PORT, () => {
    console.log(`🚀 Server listening on port ${config_1.PORT}`);
});
