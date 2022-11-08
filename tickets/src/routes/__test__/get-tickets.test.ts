import request from "supertest";
import { app } from "../../app";

describe("Get tickets", () => {
  it("should return array of tickets", async () => {
    const response = await request(app).get("/api/tickets").expect(200);

    expect(typeof response.body).toBe("object");
  });
});
