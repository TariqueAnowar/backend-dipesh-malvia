const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/dbConnection");
const mongoose = require("mongoose");

// Initialize Express
const app = express();

// Make server variable accessible throughout the file
let server;

// Connect to database before starting server
const startServer = async () => {
  try {
    const isConnected = await dbConnection();

    if (!isConnected) {
      console.error("Failed to connect to database. Server will not start.");
      process.exit(1);
    }

    // Start server only after successful DB connection
    const PORT = process.env.PORT || 5001;
    server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle database connection events
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected!");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

// Handle application shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new requests
  server.close(() => {
    console.log("HTTP server closed");
  });

  try {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error.message);
    process.exit(1);
  }
};

// Handle different termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Route not found
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
startServer();
