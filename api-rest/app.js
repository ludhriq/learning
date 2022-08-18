const fastify = require('fastify')({
    logger:true
});

fastify.register(require('./rotas/home'),{prefix:'home'});
fastify.register(require('./rotas/usuario'),{prefix:'usuario'});
fastify.register(require('./rotas/autor'),{prefix:'autor'});
fastify.register(require('./rotas/editora'),{prefix:'editora'});
fastify.register(require('./rotas/livro'),{prefix:'livro'});

const mysql = require('mysql2');
//SINGLETON
let _db;
fastify.decorateRequest('db', function(){

    if(_db) return _db;

    return _db = mysql.createPool({
        connectionLimit : 10,
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'test'
    });
});

fastify.ready(() => {
    console.log('\x1b[34mRotas: \n \x1b[33m ' + fastify.printRoutes() + '\x1b[0m')
});

fastify.listen(3000, err => {

    if (err) if(err) throw new Error(` \x1b[31m ${err} \n \x1b[0m`);
    const porta = fastify.server.address().port;
    console.log(`\n\x1b[35m server listening on ${porta}\n \x1b[0m`)
});
