import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/file.route.js";
import trackingRoutes from "./routes/tracking.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Failed to connect:", err));

app.get("/", (req, res) => {
  res.send("Backend is running with ES Modules!");
});

// Rute
app.use("/api/files", fileRoutes);

app.use("/api/trackings", trackingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
