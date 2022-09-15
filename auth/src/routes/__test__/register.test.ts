import request from "supertest";
import { app } from "../../app";

describe("Register", () => {
  it("Should fail due to missing email", () => {
    return request(app).post("/api/users/register").expect(400);
  });

  it("Should fail due to email already exists", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ email: "test@test.com", password: "123" })
      .expect(201);

    return request(app)
      .post("/api/users/register")
      .send({ email: "test@test.com", password: "123" })
      .expect(400);
  });

  it("Should success", async () => {
    const email = "test@test.com";
    const password = "123";

    const response = await request(app)
      .post("/api/users/register")
      .send({ email, password })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(email);
    expect(response.body.password).toBeUndefined();
  });
});
