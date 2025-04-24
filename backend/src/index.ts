import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/authRouter";
import router from "./routes/router";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🧠 Paperclip Backend Server is Running!");
});

app.use("/auth", authRouter);
app.use("/user", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is live at http://localhost:${PORT}`);
});
