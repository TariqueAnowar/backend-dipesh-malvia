const mongoose = require("mongoose");

const dbConnection = async (retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: "database-one",
        bufferCommands: false,
      });
      console.log(
        "Connected to MongoDB: ",
        mongoose.connection.host,
        mongoose.connection.name
      );

      return true; // Indicate successful connection
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error.message);

      if (attempt === retries) {
        console.error("Max retry attempts reached. Exiting...");
        return false; // Indicate failed connection
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

module.exports = dbConnection;
