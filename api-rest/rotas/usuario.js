module.exports = function(fastify, opts, next) {

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const signature = 'C%2!em=x*J(á[#2V,av]jbm)?rcS&kFs=s2/4mYó?';

    fastify.post('/login', (request, reply)=> {

        let {nome, senha} = request.body;

        let sql = 'SELECT * from usuario where nome = ?';

        request.db().query(sql, [nome], (error, resultado)=> {

            if(error){

                reply.send(error)
            }

            if(resultado.length === 0){

                reply.code(400).send({erro:'Senha ou nome inseridos sem correspondência'})

            } else {

                bcrypt.compare(senha, resultado[0].senha, (err, correspondencia)=> {

                    if(err){

                        reply.send(err)
                    }

                    if(correspondencia){

                        let usuario = {id:resultado[0].id,nome:nome}

                        jwt.sign({usuario}, signature, (err, token)=> {

                            reply.send({"mensagem":"Login efetuado com sucesso","token":token})
                        })
                    } else {

                        reply.code(400).send({erro:'Senha ou nome inseridos sem correspondência'})
                    }
                })
            }
        })
    })

    fastify.post('/signup', (request, reply)=> {

        let erros = [];
        const regExNome = /^[a-zA-Z]{3,}/;
        const regExSenha = /^.{5}/;

        let nome = (request.body.nome);

        let senha = (request.body.senha);

        if (!regExNome.test(nome)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'nome' com valor '${nome}' inválido`});
        }

        if (!regExSenha.test(senha)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'senha' com valor '${senha}' inválido`});
        }

        if(erros.length === 0) {

            let {nome,senha} = request.body;
            nome = nome.trim();
            bcrypt.hash(senha, 10, (err, hash)=> {

                if(err) {

                    reply.code(500).send({erro:err})

                } else {

                    let sql = 'INSERT INTO usuario (nome, senha) VALUES (?, ?)'

                    request.db().query(sql, [nome,hash], (error, result)=> {

                        if(error){

                            reply.send(error);

                        } else {

                            let usuario = {id: result.insertId,nome: request.body.nome};
                            jwt.sign({usuario}, signature, (err, token)=> {

                                reply.send({"mensagem":"Cadastro efetuado com sucesso","token":token})
                            })
                        }
                    })
                }
            })
        } else {

            reply.code(400).send(erros)
        }
    })

    fastify.delete('/:id', (request, reply)=> {

        let sql = 'DELETE FROM usuario WHERE id = ?'
        let {id} = request.params;
        console.log(id)
        console.log(request.params)
        request.db().query(sql, [id], (error, result)=> {
            if(error){
                reply.code(400).send({erro:error})
            } else {
                reply.send({result})
            }
        })
    })

    next();
}
