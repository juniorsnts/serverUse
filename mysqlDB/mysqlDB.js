const mysql = require('mysql');
const nodemailer = require('nodemailer');
const buscaEmailSenha = "SELECT email, senha FROM usuario WHERE email = ? AND senha = ?";
const buscaEmail = "SELECT email FROM usuario WHERE email = ?";
const buscaProfissoes = "SELECT *FROM profissoes ORDER BY profissao ASC";

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'useapp'
});

var obj = {
    connect: function(){
        connection.connect(function(err){
            if(err){
                return console.log("falha ao conectar ao banco");
            } else {
                console.log("conectado com banco de dados");
            }
        });
    },

    cadastroUsuario: function (res, email, senhaCriptografada){        
        connection.query(buscaEmail, [email], function(error, results){
            if(error){
                console.log("erro na busca do cadastro");
                res.json(error);
            } else if(results.length == 1){
                console.log("Usuario existe, Falha no cadastro");
                res.json("emailExiste");
            } else if(results.length == 0){
                console.log("cadastrando usuario");
                const sqlCadastro = "INSERT INTO usuario VALUES (?,?)";
                connection.query(sqlCadastro, [email, senhaCriptografada], function(error, results){
                    if(error){
                        console.log("erro no cadastro");
                        res.json(error);
                    } else{
                        console.log("Usuario novo cadastrado");
                        res.json("sucessoCadastro");
                    }
                });
            }
        });
    },

    loginUsuario: function(res, email, senhaCriptografada){
        connection.query(buscaEmailSenha, [email, senhaCriptografada], function(error, results){
            if(error){
                console.log("Erro na busca de login");
                res.json(error);
            } else if(results.length == 0){
                console.log("Erro no login, dados digitados invalidos");
                res.json("erroLogin");                
            } else if(results.length == 1){
                console.log("Usuario logado com sucesso");
                res.json("sucessoLogin");
            }
        });
    },

    updateEmail: function(res, antigoEmail, novoEmail, senhaCriptografada){
        connection.query(buscaEmailSenha, [antigoEmail, senhaCriptografada], function(error, results){
            if(error){
                console.log("Erro no login de update");
            } else if(results.length == 0){
                console.log("Este Usuario nao pode ser atualizado: "+ antigoEmail);
                res.json("falhaBuscaUpdate")
            } else if(results.length == 1){
                const sql = "UPDATE usuario SET email = ? WHERE email=?";
                connection.query(sql, [novoEmail, antigoEmail], function(error, results){
                    if(error){
                        console.log("Erro no update");
                        res.json(error);
                    } else {
                        res.json("sucessoUpdate");
                    }
                });
            }
        });      
    },

    updateSenha: function(res, email, antigaSenha, novaSenhaCriptografada){
        connection.query(buscaEmailSenha, [email, antigaSenha], function(error, results){
            if(error){
                console.log("Erro no update senha");
                res.json(error);
            } else if(results.length == 0){
                console.log("Erro na busca updateSenha");
                res.json("falhaBuscaUpdateSenha");
            } else if(results.length == 1){
                sql = "UPDATE usuario SET senha = ? WHERE email = ?";
                connection.query(sql, [novaSenhaCriptografada, email], function(error, results){
                    console.log("Senha atualizada");
                    res.json("sucessoUpdateSenha");                     
                });              
            }
        });       
    },  

    esqueciSenha: function(res, email, senhaGerada){
        
        connection.query(buscaEmail, [email], function(error, results){
            if(error){
                console.log("Erro no esqueci senha");
                res.json(error);
            } else if(results.length == 0){
                console.log("Usuario nao cadastrado (esqueciSenha)");
                res.json("semCadastro");
            } else if(results.length == 1){
                let emailRemetente = "juniorsnts123@gmail.com";
                let passRemetente = "91217180";
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: emailRemetente,
                        pass: passRemetente
                    }
                }); 

                const mailOption = {
                    from: 'juniorsnts123@gmail.com',
                    to: email,
                    subject: 'teste subject',
                    html: 'Sua nova senha é: '+'<strong>'+senhaGerada+'</strong>'
                };
        
                transporter.sendMail(mailOption, function(err, info){
                    if(err){                        
                        console.log("Falha no envio: " + err);
                        res.json("emailFalha");
                    } else {
                        console.log("Email de redefinição enviado com sucesso");
                        res.json("emailEnviado");                        
                    }
                });                          
            }
        });
    },

    buscaProfissoes: function(res){
        connection.query(buscaProfissoes, function(error, results){
            if(error){
                console.log("Erro no busca de profissoes");
                res.json(error);
            } else {
                res.json(results);
            }
        });
    }
    
}

module.exports = obj;