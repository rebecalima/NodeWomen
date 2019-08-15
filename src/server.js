const express = require('express');
const routes = require('./routes');
require('dotenv/config');

const server = express();

server.use(express.json());
server.use(routes);
server.listen(3333);

