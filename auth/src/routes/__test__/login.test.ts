import request from "supertest";
import { app } from "../../app";

describe("Login", () => {
  it("Should fail due to missing email", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ password: "kaka" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });

  it("Should fail due to missing password", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "kaka@kaka.com" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });

  it("Should fail due to invalid email format", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "kaka", password: "kaka" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });

  it("Should fail due email does not exists", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "kaka@kaka.com", password: "kaka" })
      .expect(400);

    const data = response.body;

    expect(data.errors).toBeDefined();
    expect(data.errors[0].message).toBe("user does not exist!");
  });

  it("Should fail due incorrect password", async () => {
    const email = "test@test.com";
    const password = "123";

    await request(app)
      .post("/api/users/register")
      .send({ email, password })
      .expect(201);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: email, password: "in-correct!" })
      .expect(400);

    const data = response.body;

    expect(data.errors).toBeDefined();
    expect(data.errors[0].message).toBe("wrong password!");
  });

  it("Should success", async () => {
    const email = "test@test.com";
    const password = "123";

    await request(app)
      .post("/api/users/register")
      .send({ email, password })
      .expect(201);

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: email, password })
      .expect(200);

    const data = response.body;

    expect(response.get("Set-Cookie")).toBeDefined();
    expect(data.errors).not.toBeDefined();
    expect(data.id).toBeDefined();
    expect(response.body.email).toBe(email);
  });
});
