const express = require('express');
const CriptografiaController = require('./controllers/CriptografiaController');

const routes = express.Router();

routes.get('/criptografia', CriptografiaController.index);

module.exports = routes;