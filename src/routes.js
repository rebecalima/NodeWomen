const express = require('express');
const axios = require('axios');
const fs = require('fs');
const CriptografiaController = require('./controllers/CriptografiaController');

const routes = express.Router();

routes.get('/', async (req, res) => {
    const token = process.env.TOKEN;
    const response = await axios.get(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`);
    fs.writeFile('./arquivos/answer.json', JSON.stringify(response.data), {enconding:'utf-8',flag: 'w'}, function(error){
        if(error) 
            throw error;
        console.log('Arquivo salvo!');
    });
});

routes.get('/criptografia', CriptografiaController.index);

module.exports = routes;