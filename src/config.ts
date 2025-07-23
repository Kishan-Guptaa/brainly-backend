import dotenv from "dotenv";
dotenv.config();

export const JWT_PASSWORD = process.env.JWT_PASSWORD as string;
export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
