// Import necessary modules
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import winston from "winston";
import { orderRouter, cartRouter, authRouter, userRouter, articleRouter, shopRouter, storeRouter, utileRouter, paymentRouter, categoriesRouter, usersRouter } from "./src/routes";
import { CustomError } from "./src/utils/customError";
import config from "./src/config/config";
import db from "./src/models";
import multer, { FileFilterCallback } from "multer";
import path from "node:path";

// Set up Winston for logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Create an Express application
const app: Express = express();

// Middleware setup
app.use(helmet()); // Apply helmet for security headers

// Increase the request body size limit for JSON bodies
app.use(
  express.json({
    verify: function (req: Request, res, buf) {
      if (req.path === "/api/payment/webhook") {
        (req as any).rawBody = buf; // Attach raw body for webhook verification
      }
    },
    limit: "50mb",
  })
);

// Increase the request body size limit for URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:3000"]; // Add more origins as needed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable credentials for cookies and authentication
  })
);

// HTTP logging with Morgan
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
});
app.use(limiter);

// File upload configuration using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const random = Math.floor(Math.random() * 100001) + 1;
    cb(null, `${random}-${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(null, false); // Reject the file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
    files: 6, // Maximum 6 files
  },
});

// Static file serving
app.use("/compressed", express.static(path.join(__dirname, "compressed"), { maxAge: "1d", etag: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("SERVER RUNNING");
});

app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/utile", utileRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

// Middleware for file uploads and custom middlewares
app.use(
  "/api/shop",
  upload.array("photos", 6),
  require("./src/middlewares/shop.middleware").default,
  shopRouter
);
app.use(
  "/api/store",
  upload.array("photos", 5),
  require("./src/middlewares/store.middleware").default,
  storeRouter
);

// Global error handling middleware
app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.message, err);
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      code: err.code || "UNKNOWN_ERROR",
      data: err.data || null,
    },
  });
});

// Handle 404 errors
app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError("Route not found", "ROUTE_NOT_FOUND", 404);
  next(error);
});

// Start the server
const PORT = process.env.PORT || config.port;

db.sequelize
  .sync()
  .then(() => {
    logger.info("Database synced successfully");
    app.listen(Number(PORT), () => {
      logger.info(`Server is running on port ${PORT} in ${app.get("env")} mode`);
    });
  })
  .catch((err: Error) => {
    logger.error("Error syncing database:", err.message);
    process.exit(1); // Exit the process if database sync fails
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Gracefully shutting down the server...");
  await db.sequelize.close(); // Close the database connection
  process.exit(0);
});