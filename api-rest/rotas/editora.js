module.exports = function (fastify, opts, next) {

    fastify.get('/', (request, reply) => {

        let sql = 'SELECT * FROM editora';

        request.db().query(sql, (err, result) => {

            reply.send(err || result);
        })
    });

    fastify.post('/', (request, reply) => {

        let erros = [];
        const regExNome = /^\w{2,}/;
        let nome = (request.body.nome).trim();

        if (!regExNome.test(nome)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'nome' com valor '${nome}' inválido`});
        }

        if (erros.length === 0) {

            let sql = 'INSERT INTO editora ( nome ) VALUES ( ? )';

            request.db().query(sql, [nome], (err, result) => {

                if (err) {

                    reply.send(err)

                } else if (result.serverStatus === 2) {

                    reply.send(result);
                }
            })
        } else {

            for (let x in erros) {

                if (erros[x].StatusCode === 400) {

                    reply.code(400).send(erros)
                }
            }
        }
    });

    fastify.get('/:id', (req, reply) => {

        let {id} = req.params;
        let sql = 'SELECT * FROM editora WHERE id = ?';

        req.db().query(sql, [id], (err, result) => {

            reply.send(err || result);
        })
    });

    fastify.put('/', (request, reply) => {

        const erros = [];
        const regExNome = /^([A-Za-z]){3,}/;
        const regExId = /^\d+/;
        let nome = (request.body.nome).trim();
        let id = (request.body.id).toString().trim();

        if (!regExNome.test(nome)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'nome' com valor '${nome}' inválido`});
        }

        if (!regExId.test(id)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'id' com valor '${id}' inválido`});
        }

        if (erros.length === 0) {

            let sql = 'UPDATE editora SET nome = ? WHERE id = ?';

            request.db().query(sql, [nome, id], (err, result) => {

                if (err) {

                    reply.send(err)

                } else if (result.serverStatus === 2) {

                    reply.send(result);
                }
            })
        } else {

            for (let x in erros) {

                if (erros[x].StatusCode === 400) {

                    reply.code(400).send(erros)
                }
            }
        }
    });

    fastify.delete('/:id', (request, reply) => {

        let {id} = request.params;
        let sql = 'DELETE FROM editora WHERE id = ?';

        request.db().query(sql, [id], (err, result) => {

            if (err) {

                reply.send(err)

            } else if (result.serverStatus === 2) {

                reply.send(result);
            }
        })
    });
    next();
};
