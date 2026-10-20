import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { connectDB } from "./config/db.js";

const preferredPort = Number(process.env.PORT) || 5001;

const startServer = (portToUse) => {
  const server = app
    .listen(portToUse, () => {
      console.log(`Server running on port ${portToUse}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE" && portToUse === 5000) {
        console.warn(`Port 5000 is in use (macOS AirPlay). Falling back to port 5001...`);
        startServer(5001);
      } else {
        console.error(`Failed to start server on port ${portToUse}:`, err.message);
      }
    });
  return server;
};

startServer(preferredPort);
connectDB();


