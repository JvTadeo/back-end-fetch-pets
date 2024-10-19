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

app.use(router);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`[SERVER] is running on port ${port}`);
});

