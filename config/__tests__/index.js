const server = require("../../api/server");
const request = require("supertest");
const knex = require("../../database/dbConfig");

beforeAll(async () => {
  await knex("users").truncate();
});
let token;
describe("Register endpoint", () => {
  
  it("should respond with status code 400 if username or password is empty", async () => {
    let userData = { username: "test", password: "" };
    let res = await request(server)
      .post("/api/register")
      .send(userData);
    expect(res.statusCode).toEqual(400);

    userData = { username: "", password: "test" };
    res = await request(server)
      .post("/api/register")
      .send(userData);
    expect(res.statusCode).toEqual(400);
  });
  it("should register a user", async () => {
    const userData = { username: "test", password: "test" };
    const res = await request(server)
      .post("/api/register")
      .send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user.username", "test");
  });
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
describe('Login endpoint', () => {
  it("should get list of jokes", async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe('Get joke endpoint', () => {

  it("should get respond with status code 401 if user is not authenticated", async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("Authorization", null);
    expect(res.statusCode).toEqual(401);
  });
  it("should get respond with status code 401 if token is invalid", async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("Authorization", "jgshajhkjhas");
    expect(res.statusCode).toEqual(401);
  });
});

