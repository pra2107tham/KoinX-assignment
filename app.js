import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import { connectGecko } from "./coingecko/connectgecko.js";
import cron from "node-cron";
import { getAndSaveCrypto } from "./controllers/crypto.controllers.js";
import stats from "./routes/stats.routes.js";
import deviation from './routes/deviation.routes.js';

const app = express();

// Express JSON payload size limit and CORS setup
app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Main function to connect to DB, CoinGecko API, and schedule tasks
const startApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("Successfully connected to MongoDB.");

    // Check the connection to CoinGecko API
    await connectGecko();
    console.log("Successfully connected to CoinGecko API.");

    // // Fetch and save crypto data on app start
    // await getAndSaveCrypto();

    // Schedule the cron job to fetch and save crypto data every 2 hours
    cron.schedule("0 */2 * * *", async () => {
      console.log("Running scheduled task to fetch and save crypto data...");
      try {
        await getAndSaveCrypto();
        console.log("Crypto data fetched and saved successfully.");
      } catch (error) {
        console.error("Error occurred during scheduled task:", error);
      }
    });

    // Start the Express server
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the app:", error);
    process.exit(1); // Exit with failure code
  }
};

// Start the app after connecting to the DB
startApp();
app.use(stats);
app.use(deviation);

// Global error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1); // Exit with failure code
});

export { app };
