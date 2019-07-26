const server = require("../../api/server");
const request = require("supertest");
const knex = require("../../database/dbConfig");

beforeAll(async () => {
  await knex("users").truncate();
});

describe("User routes", () => {
  let token;
  it("should register a user", async () => {
    const userData = { username: "test", password: "test" };
    const res = await request(server)
      .post("/api/register")
      .send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user.username", "test");
  });

  it("should login a user", async () => {
    const userData = { username: "test", password: "test" };
    const res = await request(server)
      .post("/api/login")
      .send(userData);
    token = res.body.token;
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should get list of jokes", async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
  });
});
