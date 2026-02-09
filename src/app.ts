import express from "express";

import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";
import { medicineRouter } from "./modules/medicine/medicine.routes";
import { categoryRouter } from "./modules/category/category.route";

const app = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/medicine", medicineRouter);
app.use("/category", categoryRouter);



app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Medi-Store Server API is running ",
  });
});

// error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
