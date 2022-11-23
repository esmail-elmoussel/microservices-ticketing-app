import request from "supertest";
import { app } from "../../app";

describe("Get tickets", () => {
  it("should return array of tickets", async () => {
    await request(app)
      .post("/api/orders/")
      .set("Cookie", global.register())
      .send({ title: "New Ticket", price: 100 })
      .expect(201);

    const response = await request(app).get("/api/orders").expect(200);

    expect(typeof response.body).toBe("object");
    expect(typeof response.body.length).toBe("number");
    expect(response.body.length).toBe(1);
  });
});
