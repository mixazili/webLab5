const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./config/logger");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    logger.info("MongoDB connected");
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (err) {
    logger.error("MongoDB connection failed", {
      error: err.message,
    });
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
})();
