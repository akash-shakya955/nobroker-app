import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
import userRoutes from "./src/routes/userRoutes.js";
app.use("/api/users", userRoutes);

import propertyRoutes from "./src/routes/propertyRoutes.js";
app.use("/api/properties", propertyRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("NoBroker backend running!");
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
