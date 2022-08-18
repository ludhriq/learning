const Livro = require('./Livro');

module.exports = function (fastify, opts, next) {

    fastify.get('/', (request, reply) => {

        let sql = 'SELECT * FROM livro';

        request.db().query(sql, (err, result) => {

            reply.send(err || result)
        })
    });

    fastify.route({
        path: '/teste',
        method: ['POST', 'PUT'],
        handler: (request, reply) => {

            const {id = null, titulo, descricao, paginas} = request.body;

            let livro = new Livro(id, titulo, descricao, paginas);

                livro.salvar(request.db, (err) => {

                reply.send(err ? err : livro);
            });
        }
    });

    fastify.post('/', (request, reply) => {

        let erros = [];
        const regExTitulo = /^\w+/;
        const regExDescricao = /^\w+/;
        const regExPaginas = /^\d+$/;
        const regExId_Autor = /^\d+$/;

        let titulo = (request.body.titulo).trim();
        let descricao = (request.body.descricao);
        let paginas = (request.body.paginas).toString().trim();
        let id_autor = (request.body.id_autor);

        if (!regExTitulo.test(titulo)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'título' com valor '${titulo}' inválido`})
        }

        if (descricao === undefined) {

            descricao = null

        } else {

            descricao = descricao.toString().trim();

            if (!regExDescricao.test(descricao)) {

                erros.push({
                    statusCode: 400,
                    mensagem: `Erro: parâmetro 'descricao' com valor '${descricao}' inválido`
                });
            }
        }

        if (!regExPaginas.test(paginas) || paginas < 6) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'paginas' com valor '${paginas}' inválido`})
        }

        if (id_autor === undefined) {

            id_autor = null;

        } else if (!regExId_Autor.test(id_autor)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'id_autor' com valor '${id_autor}' inválido`});
        }

        if (erros.length === 0) {

            let {titulo, descricao = null, paginas, id_autor = null} = request.body;

            titulo = titulo.trim();

            if( descricao !== null){

                descricao = descricao.trim();
            }

            let sql = 'INSERT INTO livro (titulo, descricao, paginas, id_autor) VALUES ( ?, ?, ?, ?)';

            request.db().query(sql, [titulo, descricao, paginas, id_autor], (err, result) => {

                reply.send(err || result)
            })
        } else {

            for (let x in erros) {

                if (erros[x].statusCode === 400) {

                    reply.code(400).send(erros)
                }
            }
        }
    });

    fastify.get('/:id', (request, reply) => {

        let {id} = request.params;
        let sql = 'SELECT * FROM autor WHERE id = ?';

        request.db().query(sql, [id], (err, result) => {

            reply.send(err || result);
        })
    });

    fastify.put('/', (request, reply) => {

        let erros = [];
        const regExTitulo = /^\w+/;
        const regExDescricao = /^\w+/;
        const regExPaginas = /^\d+$/;
        const regExId_Autor = /^\d+$/;
        const regExId = /^\d+$/;

        let titulo = (request.body.titulo).trim();
        let descricao = (request.body.descricao);
        let paginas = (request.body.paginas).toString().trim();
        let id_autor = (request.body.id_autor);
        let id = request.body.id;

        if (!regExTitulo.test(titulo)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'título' com valor '${titulo}' inválido`})
        }

        if (descricao === undefined) {

            descricao = null

        } else {

            descricao = descricao.toString().trim();

            if (!regExDescricao.test(descricao)) {

                erros.push({
                    statusCode: 400,
                    mensagem: `Erro: parâmetro 'descricao' com valor '${descricao}' inválido`
                });
            }
        }

        if (!regExPaginas.test(paginas) || paginas < 6) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'paginas' com valor '${paginas}' inválido`})
        }

        if (id_autor === undefined) {

            id_autor = null;

        } else if (!regExId_Autor.test(id_autor)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'id_autor' com valor '${id_autor}' inválido`});
        }

        if (!regExId.test(id)) {

            erros.push({statusCode: 400, mensagem: `Erro: parâmetro 'id' com valor '${id}' inválido`});
        }

        if (erros.length === 0) {

            let {titulo, descricao = null, paginas, id_autor = null, id} = request.body;

            titulo = titulo.trim();

            if( descricao !== null){

                descricao = descricao.trim();
            }

            let sql = 'UPDATE livro SET titulo = ?, descricao = ?, paginas = ?, id_autor = ? WHERE id= ?';

            request.db().query(sql, [titulo, descricao, paginas, id_autor, id], (err, result) => {

                reply.send(err || result)
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
        let sql = ' DELETE FROM livro where id = ?';

        request.db().query(sql, [id], (err, result) => {

            reply.send(err || result)
        })
    });
    next();
};
