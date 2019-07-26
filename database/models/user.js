const knex = require("../dbConfig");
const { ErrorHandler } = require("express-error-bouncer");

const create = async userData => {
  try {
    const [id] = await knex("users").insert(userData);
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
};

const findBy = async userData => {
  try {
    return await  knex("users").where({ ...userData }).first();
  } catch (error) {
    throw new ErrorHandler(500, error.message);
  }
};

module.exports = {
  create, findBy
}
