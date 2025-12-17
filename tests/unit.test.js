import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";

describe("JWT unit tests", () => {
  const SECRET = "test_secret";

  it("should sign and verify access token", () => {
    const payload = { userId: "123", username: "test" };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1m" });
    const decoded = jwt.verify(token, SECRET);

    expect(decoded.userId).toBe("123");
    expect(decoded.username).toBe("test");
  });

  it("should throw error for invalid token", () => {
    const token = jwt.sign({ userId: "123" }, SECRET);

    expect(() => {
      jwt.verify(token, "wrong_secret");
    }).toThrow();
  });
});
