const db = require('../Database/db')
const crypto = require('crypto')

class pj_controller {

    async create(req, res){

        const { nome_empresa, tipo_servico, email, celular, longitude, latitude,
        cep, rua, bairro, cidade, numero } = req.body

        // Query para inserir na tabela PESSOA JURIDICA
        const queryJuridica = `INSERT INTO pessoa_juridica (
            nome_empresa,
            tipo_servico,
            email,
            celular,
            longitude,
            latitude
        )VALUES(?,?,?,?,?,?)`
        
        //Valores para insetir na tabela PESSOA JURIDICA
        const valuesJuridica = [
            nome_empresa,
            tipo_servico,
            email,
            celular,
            longitude,
            latitude
        ]

        try {
            db.query(queryJuridica, valuesJuridica)
        } catch (error) {
            console.log(error)
        }

        const id = await resultQuery()

            function resultQuery(){
                return new Promise((resolve, reject)=>{
                    db.query(`SELECT id FROM pessoa_juridica WHERE email = '${email}'`,
                    function(error, rows, fields){
                        resolve(rows[0].id)
                        //resolve(JSON.Number(rows[0].id))
                    })
                })
            }

        //Query para insetir na tabela Endereço Geral
        const queryAddres = `INSERT INTO enderecos(
            cep,
            rua,
            bairro,
            cidade,
            numero,
            fk_id_juridicas
        )VALUES(?,?,?,?,?,?);`

        //Valores para inserir na tabela Endereço Geral
        const valuesAddres = [
            cep,
            rua,
            bairro,
            cidade,
            numero,
            id
        ]
            try {
                db.query(queryAddres, valuesAddres)
            } catch (error) {
                console.log(error)
            }

            try {
                db.query(`SELECT * FROM enderecos INNER JOIN pessoa_juridica ON enderecos.fk_id_juridicas = pessoa_juridica.id WHERE email = '${email}';`,
                function(err, rows){
                    res.status(201).json(rows)
                })  
            } catch (error) {
                console.log(error)
            }
        
    }

    async loadList(req, res){
        const search = req.params.search
        db.query(`SELECT * FROM enderecos INNER JOIN pessoa_juridica ON enderecos.fk_id_juridicas = pessoa_juridica.id WHERE tipo_servico LIKE '%${search}%'`,
        function(err, rows){
            if (err){
                return res.status(400).json(err)
            }else{
                res.status(200).json(rows)
            }
        })
    }
}

module.exports = new pj_controller()