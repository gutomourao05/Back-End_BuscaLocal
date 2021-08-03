const db = require('../Database/db')
const crypto = require('crypto')

class pj_controller {

    async create(req, res){

        const { name_company, type_services, show_type_services, descriptionServices, email, phone, longitude, latitude,
        zip_code, road, district, city, number_place } = req.body

        // Query para inserir na tabela PESSOA JURIDICA
        const queryCompany = `INSERT INTO companies (
            name_company,
            type_services,
            show_type_services,
            descriptionServices,
            email,
            phone,
            longitude,
            latitude
        )VALUES(?,?,?,?,?,?,?,?)`
        
        //Valores para insetir na tabela PESSOA JURIDICA
        const valuesCompany = [
            name_company,
            type_services,
            show_type_services,
            descriptionServices,
            email,
            phone,
            longitude,
            latitude
        ]

        try {
            db.query(queryCompany, valuesCompany)
        } catch (error) {
            console.log(error)
        }

        const id = await resultQuery()

            function resultQuery(){
                return new Promise((resolve, reject)=>{
                    db.query(`SELECT id FROM companies WHERE email = '${email}'`,
                    function(error, rows, fields){
                        resolve(rows[0].id)
                    })
                })
            }

        //Query para insetir na tabela Endereço Geral
        const queryAddress = `INSERT INTO address(
            zip_code,
            road,
            district,
            city,
            number_place,
            fk_id_companies
        )VALUES(?,?,?,?,?,?);`

        //Valores para inserir na tabela Endereço Geral
        const valuesAddress = [
            zip_code,
            road,
            district,
            city,
            number_place,
            id
        ]
            try {
                db.query(queryAddress, valuesAddress)
            } catch (error) {
                console.log(error)
            }

            try {
                db.query(`SELECT * FROM address INNER JOIN companies ON address.fk_id_companies = companies.id WHERE email = '${email}';`,
                function(err, rows){
                    res.status(201).json(rows)
                })  
            } catch (error) {
                console.log(error)
            }
        
    }

    async loadList(req, res){
        const search = req.params.search
        db.query(`SELECT * FROM address INNER JOIN companies ON address.fk_id_companies = companies.id WHERE type_services LIKE '%${search}%'`,
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