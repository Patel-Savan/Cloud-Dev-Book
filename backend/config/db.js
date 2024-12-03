const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use the mongoURI from environment variables
    const mongoURI = process.env.mongoURI;

    // Ensure mongoURI exists
    if (!mongoURI) {
      console.error("MongoDB URI is not defined in environment variables.");
      process.exit(1); // Exit if mongoURI is not set
    }

    // Connect to MongoDB (DocumentDB)
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true, // Ensure SSL is enabled for DocumentDB
      sslValidate: false, // Optional: disable SSL validation (DocumentDB-specific)
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;
