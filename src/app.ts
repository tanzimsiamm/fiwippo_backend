import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

//health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//routes
app.use("/api", router);

app.use(GlobalErrorHandler);

export default app;
