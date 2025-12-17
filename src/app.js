const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const { verifyAccessToken } = require("./middlewares/authMiddleware");
const logger = require("./config/logger");
const { client } = require("./config/monitor");

const app = express();

/* =======================
   Global middlewares
======================= */
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =======================
   Routes
======================= */
app.use("/api/auth", authRoutes);

/**
 * Protected route (JWT demo)
 */
app.get("/api/private", verifyAccessToken, (req, res) => {
  logger.info("Private route accessed", {
    userId: req.user.id,
    ip: req.ip,
  });

  res.json({
    message: "Access granted",
    user: req.user,
  });
});

/**
 * Metrics (Prometheus)
 */
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

/**
 * Healthcheck
 */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
