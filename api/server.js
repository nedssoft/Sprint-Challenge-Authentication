const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { bouncer } = require('express-error-bouncer')
const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

configureRoutes(server);

server.use(bouncer);
module.exports = server;
