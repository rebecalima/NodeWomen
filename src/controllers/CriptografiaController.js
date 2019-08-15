const axios = require('axios');
const sha1 = require('node-sha1');
const answer = require('../../arquivos/answer.json');
const fs = require('fs');
const token = process.env.TOKEN;
const FormData = require('form-data');

module.exports = {
    async index(req, res){
        const numeroCasas = answer.numero_casas;
        const frase = answer.cifrado;
        function containsNumber(f){
            let code = f.charCodeAt(0)
            if(code >= 48 && code <= 57)
                return true;
            return false;
        }
        function notDecipherable(f){
            if(f == ',' || f == " " || f == '.' || containsNumber(f))
                return true;
            return false;
        }
        function validateExcess(code){
            if(code < 97){
                return (123 - (97 - code));
            }
            return code;
        }
        async function decipher(){
            let novaFrase = [].map.call(frase.toLowerCase(), function(f){
                if(notDecipherable(f))
                    return f
                let code = f.charCodeAt(f)-numeroCasas; 
                return String.fromCharCode(validateExcess(code));
            }).join('');
            return novaFrase;
        }

        function generateSummary(){
            return sha1(answer.decifrado);
        }

        answer.decifrado = await decipher();
        answer.resumo_criptografico = await generateSummary();
        fs.writeFile('./arquivos/answer.json', JSON.stringify(answer),{enconding:'utf-8',flag: 'w'}, function (error) {
            if (error) 
                throw error;
            //console.log('Arquivo salvo!');  
        });

        async function sendResult(){
            let formData = new FormData();
            formData.append('answer', fs.createReadStream('./arquivos/answer.json'));  
            axios({
                method: 'post',
                url: `api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`,
                data: formData,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
                })
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
        }
        sendResult();
        //console.log(response.data);
        return res.json( { ok: true } );
    }, 
    store(req, res){
        if (req.method === 'POST') {
            let body = '';
            let i = 0;
            req.on('data', chunk => {
                body += chunk; // convert Buffer to string
            });
            req.on('end', () => {
                fs.writeFile('./arquivos/answer2.json', body,{enconding:'utf-8',flag: 'w'}, function (error) {
                    if (error) 
                        throw error;
                    //console.log('Arquivo salvo!');  
                });
                res.end(body);
            });
        }   
    }
}