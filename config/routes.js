const axios = require("axios");
const { ErrorHandler } = require("express-error-bouncer");
const { authenticate, generateToken } = require("../auth/authenticate");
const bcrypt = require("bcryptjs");
const User = require("../database/models/user");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ErrorHandler(400, "username or password are required");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    if (!user) {
      throw new ErrorHandler(500, "Unable to save the user in the database");
    }
    return res.status(201).json({
      user
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ErrorHandler(400, "username or password are required");
  }
  const user = await User.findBy({username});
  const passwordMatched = user && bcrypt.compareSync(password, user.password);
  if (!passwordMatched) {
    throw new ErrorHandler(401, "Invalid credentials");
  }
  const token = generateToken({_uuid: user.id});
  return res.status(200).json({
    message: `Welcome ${username}`,
    token
  });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
