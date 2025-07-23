
// import express from "express";
// import mongoose from "mongoose";

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

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD, MONGO_URI, PORT } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utlis";

// Load .env variables
dotenv.config();

const app = express();

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    await UserModel.create({ username, password });
    res.json({ message: "User Signed Up" });
  } catch (e) {
    res.status(411).json({ message: "User already exists" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await UserModel.findOne({ username, password });
  if (existingUser) {
    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Incorrect credentials" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type, title } = req.body;
  await ContentModel.create({
    link,
    type,
    title,
    // @ts-ignore
    userId: req.userId,
    tags: [],
  });
  res.json({ message: "Content added" });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  // @ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({ userId }).populate("userId", "username");
  res.json({ content });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const { contentId } = req.body;
  await ContentModel.deleteMany({
    contentId,
    // @ts-ignore
    userId: req.userId,
  });
  res.json({ message: "Deleted" });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const { share } = req.body;

  if (share) {
    const existingLink = await LinkModel.findOne({
      // @ts-ignore
      userId: req.userId,
    });
    if (existingLink) {
      return res.json({ hash: existingLink.hash });
    }
    const hash = random(10);
    await LinkModel.create({
      // @ts-ignore
      userId: req.userId,
      hash,
    });
    res.json({ hash });
  } else {
    await LinkModel.deleteOne({
      // @ts-ignore
      userId: req.userId,
    });
    res.json({ message: "Removed link" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({ hash });

  if (!link) {
    return res.status(411).json({ message: "Sorry incorrect input" });
  }

  const content = await ContentModel.find({ userId: link.userId });
  const user = await UserModel.findOne({ _id: link.userId });

  if (!user) {
    return res.status(411).json({ message: "User not found" });
  }

  res.json({
    username: user.username,
    content,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
