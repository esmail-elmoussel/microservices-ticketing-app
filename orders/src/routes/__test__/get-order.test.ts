import request from "supertest";
import { app } from "../../app";

describe("Get ticket", () => {
  it("should fail due to invalid id", async () => {
    await request(app).get("/api/orders/asdas6d7as").expect(400);
  });

  it("should fail due to ticket not found", async () => {
    await request(app).get("/api/orders/6369d2937246740ae7556478").expect(404);
  });

  it("should fail due to ticket not found", async () => {
    const response = await request(app)
      .post("/api/orders/")
      .set("Cookie", global.register())
      .send({ title: "New Ticket", price: 100 });

    await request(app).get(`/api/orders/${response.body.id}`).expect(200);
  });
});
