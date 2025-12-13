import httpStatus from "http-status";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize"; // <-- Mongo sanitization

import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";

// Load environment variables
dotenv.config();

const app: Application = express();

// ----------------------
// Rate Limiter
// ----------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// ----------------------
// Middlewares
// ----------------------
app.use(cors());                        // Handle cross-origin requests
app.use(helmet());                      // Secure headers
app.use(express.json());                // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(apiLimiter);                    // Apply rate limiter globally
app.use(mongoSanitize());               // Sanitize requests to prevent MongoDB operator injection

// ----------------------
// Health Check
// ----------------------
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// ----------------------
// Routes
// ----------------------
app.use("/api", router);

// ----------------------
// Global Error Handler
// ----------------------
app.use(GlobalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
