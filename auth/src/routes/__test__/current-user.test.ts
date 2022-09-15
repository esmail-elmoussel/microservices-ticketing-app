import request from "supertest";
import { app } from "../../app";

describe("Current User", () => {
  it("Should return current user", async () => {
    const cookie = await global.register();

    const response = await request(app)
      .get("/api/users/current-user")
      .set("Cookie", cookie)
      .expect(200);

    expect(response.body.email).toBe("test@test.com");
  });
});
