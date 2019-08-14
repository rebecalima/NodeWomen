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
            var code = f.charCodeAt(0)
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
            var novaFrase = [].map.call(frase.toLowerCase(), function(f){
                if(notDecipherable(f))
                    return f
                var code = f.charCodeAt(f)-numeroCasas; 
                return String.fromCharCode(validateExcess(code));
            }).join('');
            return novaFrase;
        }

        async function generateSummary(){
            return sha1(answer.decifrado);
        }

        answer.decifrado = await decipher();
        answer.resumo_criptografico = await generateSummary();
        fs.writeFile('./arquivos/answer.json', JSON.stringify(answer),{enconding:'utf-8',flag: 'w'}, function (error) {
            if (error) 
                throw error;
            console.log('Arquivo salvo!');  
        });

        function sendResult(){

            var formData = new FormData();
            formData.append('answer', fs.createReadStream('../../arquivos/answer.json'));  
            const request_config = {
                headers: {
                  "Content-Type": "multipart/form-data"
                },
                data: formData
              };
            axios.post(`https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=${token}`, formData, request_config)
            .then(result => {
                if(result.status === 200)
                    console.log(result.data);
                else
                    console.log("Deu ruim");
            })
            .catch(ex => {
                console.log(ex)
            });
            
        }
        sendResult();
        //console.log(response.data);
        //eturn res.json( { ok: true } );
    }
}