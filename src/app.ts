import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// Middleware para erros
app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`[SERVER] is running on port ${port}`);
});

