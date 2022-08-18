module.exports = function (fastify, opts, next) {

    fastify.get('/', function(request, reply) {

        let sql = 'SELECT * FROM autor LIMIT 30';

        request.db().query(sql, (err, result) => {

            reply.send(err || result)
        })
    })

    fastify.post('/', function (request, reply) {

        const erros = [];
        const regExNome = /([A-Za-z]){3,}/;
        const regExIdade = /^[0-9]{1,3}/;

        if(request.body === null) {
            reply.code(400).send({statusCode:400, mensagem:'Não foram informados valores para os parâmetros do corpo da requisição.'})

        } else {

            const nome = (request.body.nome).trim();
            const idade = request.body.idade;

            if (typeof (nome) === "string" && regExNome.test(nome)) {

            } else {

                erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'nome' com valor '${nome}' inválido`});
            }

            if (regExIdade.test(idade)) {

                if (idade > 0 && idade < 123) {

                } else {

                    erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'idade' com valor '${idade}' inválido`});
                }

            } else {

                erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'idade' com valor '${idade}' inválido`});
            }

            if (erros.length === 0) {

                let {nome, idade} = request.body;
                nome = nome.trim();
                idade = idade.trim();
                let sql = 'INSERT INTO autor ( nome, idade ) VALUES ( ? , ? )';

                request.db().query(sql, [nome, idade], (error, result) => {

                    if (error) {

                        reply.send(error)

                    } else if (result.serverStatus === 2) {

                        reply.send(result);
                    }
                })
            } else {

                for (let x in erros) {

                    if (erros[x].statusCode === 400) {

                        reply.code(400).send(erros)
                    }
                }
            }
        }// else body
    });

    fastify.get('/:id', (request, reply) => {

        let {id} = request.params;
        let sql = 'SELECT * FROM autor WHERE id = ?';

        request.db().query(sql, [id], (err, result) => {

            reply.send(err || result)
        })
    });

    fastify.put('/', (request, reply) => {

        let erros = [];
        const regExNome = /^([A-Za-z]){3,}/;
        const regExIdade = /^\d{1,3}$/;
        const regExId = /^\d+$/;

        let nome = (request.body.nome).trim();
        let idade = (request.body.idade).toString().trim();
        let id = (request.body.id).toString().trim();

        if (!regExNome.test(nome)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'nome' com valor '${nome}' inválido`});
        }

        if (regExIdade.test(idade)) {

            if (idade > 0 && idade < 123) {

            } else {

                erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'idade' com valor '${idade}' inválido`});
            }

        } else {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'idade' com valor '${idade}' inválido`});
        }

        if (!regExId.test(id)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'id' com valor '${id}' inválido`})
        }

        if (erros.length === 0) {

            let {nome, idade, id} = request.body;
            nome = nome.trim();
            idade = idade.toString().trim();
            id = id.toString().trim();

            let sql = `UPDATE autor SET nome = ?,idade = ? where id = ?`;

            request.db().query(sql, [nome, idade, id], (error, result) => {

                if (error) {

                    reply.send(error)

                } else if (result.serverStatus === 2) {

                    reply.send(result);
                }
            })

        } else {

            for (let x in erros) {

                if (erros[x].statusCode === 400) {

                    reply.code(400).send(erros)
                }
            }
        }
    });

    fastify.delete('/:id', (request, reply) => {

        let {id} = request.params;
        let sql = 'DELETE FROM autor WHERE id= ?';

        request.db().query(sql, [id], (err, result) => {

            reply.send(err || result)
        })
    });
    next();
};
