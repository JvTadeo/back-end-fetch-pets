import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { Request, Response, NextFunction } from "express";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`[SERVER] is running on port ${port}`);
});

