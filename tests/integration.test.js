import mongoose from "mongoose";
import { describe, beforeAll, afterAll, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../src/app";

vi.setTimeout(60000); // 60 секунд на все тесты

const MONGO_URI = process.env.MONGO_URI;

describe("Auth integration tests", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("should register user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "vitestuser",
      password: "12345678",
    });
    expect(res.statusCode).toBe(201);
  });

  it("should login user and return access token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "vitestuser",
      password: "12345678",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});
