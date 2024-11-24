import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);


app.listen(port, () => {
  console.log(`[SERVER] is running on port ${port}`);
});

