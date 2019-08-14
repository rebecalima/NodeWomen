const axios = require('axios');
const sha1 = require('node-sha1');

module.exports = {
    async index(req, res){
        
        function decifrar(frase){
            var novaFrase = [].map.call(frase.cifrado.toLowerCase(), function(f){
                return f.charCodeAt(f);
            });
            return novaFrase;
        }
        console.log(decifrar("response.data"));
        return res.json({ok: true});
    }
}