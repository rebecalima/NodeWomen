const axios = require('axios');
const sha1 = require('node-sha1');

module.exports = {
    async index(req, res){
        const token = process.env.TOKEN;
        const response = await axios.get(`https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=${token}`);
        return res.json(response.data);
    }
}