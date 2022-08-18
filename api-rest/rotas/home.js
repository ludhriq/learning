module.exports = (fastify, opts, next)=> {
    const fs = require('fs')
    fastify.get('/', (request, reply)=> {
        fs.readFile('./html/index.html',  (err, data)=> {
            if(err){
                reply.code(404).send({"erro": err})
            } else {
                reply.header('Content-Type','text/html; charset=utf-8')
                reply.code(200).send(data)
            }
        })
    })

    next();
}
