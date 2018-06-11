const crypto = require('crypto');
const criptografar_dados = {
    algoritmo: "aes256",
    segredo: "asd123",
    tipo: "hex"
}
var obj = {
    //criptografando senha
    criptografar: function (senha){
        const cypher = crypto.createCipher(criptografar_dados.algoritmo, criptografar_dados.segredo);
        cypher.update(senha);
        return cypher.final(criptografar_dados.tipo);
    },

}

module.exports = obj;