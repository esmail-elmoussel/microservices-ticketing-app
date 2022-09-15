import request from "supertest";
import { app } from "../../app";

describe("Logout", () => {
  it("Should clear cookies", async () => {
    const registerResponse = await request(app)
      .post("/api/users/register")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    expect(registerResponse.get("Set-Cookie")[0].includes("session=")).toBe(
      true
    );

    const response = await request(app).post("/api/users/logout").expect(200);

    expect(response.get("Set-Cookie")[0].includes("session=;")).toBe(true);
  });
});
