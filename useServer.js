const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbMysql = require('./mysqlDB/mysqlDB.js');
const crypto = require('./criptografia/criptografia.js');
const port = 3000;
const SHA256 = require('sha256');

dbMysql.connect();

//pegando tipos de entradas pelo post
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//liberando acesso externo
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const router = express.Router();

//criando as rotas
router.post('/cadastroUsuario', (req, res) => {
    const email = req.body.email;
    const senha = crypto.criptografar(req.body.senha);    
    dbMysql.cadastroUsuario(res, email, senha);
});

router.post('/loginUsuario', (req, res) => {
    const email = req.body.email;
    const senha = crypto.criptografar(req.body.senha);
    dbMysql.loginUsuario(res, email, senha);
});

router.post('/updateEmail', (req, res) => {
    const email = req.body.email;
    const novoEmail = req.body.novoEmail;
    const senha = crypto.criptografar(req.body.senha);
    dbMysql.updateEmail(res, email, novoEmail, senha);
});

router.post('/updateSenha', (req, res) => {
    const email = req.body.email;
    const antigaSenha = req.body.antigaSenha;
    const novaSenha = crypto.criptografar(req.body.novaSenha);
    dbMysql.updateSenha(res, email, antigaSenha, novaSenha);
});

router.post('/esqueciSenha', (req, res) => {
    const email = req.body.email;
    let password = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(var i=0; i<20; i++)
    password += chars.charAt(Math.random()*61);
    senhaSHA = SHA256(password);
    senhaCriptografada = crypto.criptografar(senhaSHA);
    dbMysql.esqueciSenha(res, email, senhaCriptografada);
});

router.post('/dadosPessoais', (req, res) => {
    const email = req.body.email;
    const nome = req.body.nome;
    const endereco = req.body.endereco;
    const complemento = req.body.complemento;
    const cidade = req.body.cidade;
    const estado = req.body.estado;
    const bairro = req.body.bairro;
    const telefone = req.body.telefone;
    const cpf = req.body.cpf;
    const fotoPerfil = req.body.fotoPerfil;

    dbMysql.formPessoal(res, email, nome, endereco, complemento, cidade, estado, bairro, telefone, cpf, fotoPerfil);
});

router.post('/dadosProfissionais', (req, res) => {
    const email = req.body.email;
    const profissao1 = req.body.profissao1;
    const valor1 = req.body.valor1;    
    const profissao2 = req.body.profissao2;
    const valor2 = req.body.valor2;

    dbMysql.formProfissional(res, email, profissao1, valor1, profissao2, valor2);
});

router.get('/buscaProfissoes', (req, res) => {
    dbMysql.buscaProfissoes(res);
});



app.use('/', router);

app.listen(port, function(){
    console.log('Servidor rodando na porta: '+ port);
});