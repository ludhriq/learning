module.exports = class Livro {

    constructor(id, titulo, descricao, paginas) {

        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.paginas = paginas;
    }

    validar() {

        let props = {

            id(value){

                return value ? (Number(value) === value) : true;
            },
            titulo(value){

                return value && value.trim().length;
            },
            descricao(value){

                return value && value.trim().length;
            },
            paginas(value){

                return value && value > 0;
            }
        }

        let errors = [];

        for(let p in props){

            if(!props[p](this[p])){

                errors.push(`A propriedade ${p} é invalida.`);
            }
        }

        return errors;
    }

    salvar(db, cb) {

        let errors = this.validar();

        if(errors.length){

            return cb(new Error(errors.join('\n')));
        }

        if(this.id){

            //update
            let sql = `UPDATE livro SET `;
            let where = `WHERE `;
            let binds = [];
            let id = this.id;

            for(let p in this){

                if(p === 'id'){

                    where += `\`id\` = ?`;
                    continue;
                }

                binds.push(this[p]);
                sql += `\`${p}\` = ?, `;
            }

            sql = `${sql.substr(0, sql.length - 2)} ${where}`;
            binds.push(id);

            return db().query(sql, binds, cb);

        } else {

            //insert
            let sql = `INSERT livro `;
            let columns = ``;
            let values = ``;
            let binds = [];

            for(let p in this){

                columns += `${p}, `;
                values += `?, `;
                binds.push(this[p]);
            }

            columns = `(${columns.substr(0, columns.length - 2)})`;
            values = `(${values.substr(0, values.length - 2)})`;
            sql += `${columns} VALUES ${values}`;

            return db().query(sql, binds, (err, result) => {
                
                this.id = result.insertId;
                return cb(err);
            });
        }
    }

    excluir() {


    }
}

// BUG:

// w1: do {
//
//     a.push(new Livro(x, `Livro ${x}`));
//     x++;
//
//     let y = true;
//
//     while(y){
//
//         if(x === 5) break w1;
//         console.log('a');
//         y = false;
//     }
//
// } while(x < 10);
//
// console.log(a);
//
// s1: switch('a'){
//
//     case 'a': {
//
//         break;
//     }
// }


// let i = new Livro(2, '           Só o básico                            ','',123);

// console.log(i)
// console.log(`Validação: \x1b[33m${i.validar()}`)
// console.log(i.salvar())
