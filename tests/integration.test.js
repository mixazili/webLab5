// tests/integration.test.js
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../src/app");
const { describe, it, expect, beforeAll, afterAll } = require("vitest"); // <--- импортируем

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://root:example@mongo:27017/lab5";

describe("Auth integration tests", function () {
  this.timeout(30000); // 30 секунд на весь describe

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("should register user", async function () {
    this.timeout(10000);
    const res = await request(app).post("/api/auth/register").send({
      username: "vitestuser",
      password: "12345678",
    });

    expect(res.statusCode).toBe(201);
  });

  it("should login user and return access token", async function () {
    this.timeout(10000);
    const res = await request(app).post("/api/auth/login").send({
      username: "vitestuser",
      password: "12345678",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
