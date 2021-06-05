const db = require('../Database/db')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcrypt');

const trasnporter =  nodemailer.createTransport({ // Configuração Nodemailer
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "buscaalocal@gmail.com",
        pass: "policia0"
    },
    tls: {
        rejectUnauthorized: false
    }
});

class pf_controller {

    async create(req, res) { // Função de Cadastro Pessoa fisica

        const { nome, email, nascimento, sexo, senha, celular, cep, rua, bairro, cidade } = req.body

        // BCrypt - Encripitando a senha
        const salt = await bcrypt.genSalt(10);
        const novaSenha = await bcrypt.hash(senha, salt);

        // Query para insetir na tabela PESSOA FISICA
        const queryFisica = `INSERT INTO pessoa_fisica(
            nome,
            email,
            nascimento,
            sexo,
            senha,
            celular
        )VALUES(?,?,?,?,?,?);`
        
        //Valores para insetir na tabela PESSOA FISICA
        const valuesFisica = [
            nome,
            email,
            nascimento,
            sexo,
            novaSenha,
            celular
        ]

        try {
            await db.query(queryFisica, valuesFisica)
        } catch (error) {
            console.log(error)
        }

        const id = await resultQuery()

            function resultQuery(){
                return new Promise((resolve, reject)=>{
                    db.query(`SELECT id FROM pessoa_fisica WHERE email = '${email}'`,
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
            fk_id_fisicas
        )VALUES(?,?,?,?,?);`
        
        //Valores para inserir na tabela Endereço Geral
        const valuesAddres = [
            cep,
            rua,
            bairro,
            cidade,
            id
        ] 

            try {
                db.query(queryAddres, valuesAddres)
            } catch (error) {
                console.log(error)
            }

            try {
                db.query(`SELECT * FROM enderecos INNER JOIN pessoa_fisica ON enderecos.fk_id_fisicas = pessoa_fisica.id WHERE email = '${email}';`,
                function(err, rows){
                    res.status(201).json(rows)
                })  
            } catch (error) {
                console.log(error)
            }

    } // Fim Cadastro Pessoa Fisica

    login(req, res){ // Função de Login
        const { email, senha } = req.body
        db.query(`SELECT * FROM pessoa_fisica WHERE email = '${email}'`,
        async function(err, rows){
            for(var row in rows){
                const senhaValidation = await bcrypt.compare(senha, rows[row].senha)
                if(senhaValidation){
                    res.status(200).json(rows[row])
                }else{
                    res.status(400).json({Erro: 'Senha incorreta.'})
                }
            }
        })
    } // Fim função Login

    async emailPassword(req, res){ // Função para recuperar senha 
        const { email } = req.body

        const novaSenha = crypto.randomBytes(4).toString('hex')
        const salt = await bcrypt.genSalt(10);
        const senha = await bcrypt.hash(novaSenha, salt);

        
            db.query(`UPDATE pessoa_fisica SET senha = '${senha}' WHERE email = '${email}'`,
            function(err){
                if(err) return console.log(err)
        })

            db.query(`SELECT * FROM pessoa_fisica WHERE email = '${email}'`,
                async function(err, rows){
                    for(let row in rows){
                        await trasnporter.sendMail({
                            from: "Busca Local <buscaalocal@gmail.com>",
                            to: email,
                            subject: "BUSCA LOCAL - RECUPERAÇÃO DE SENHA",
                            text: `Olá, ${rows[row].nome} você solicitou a troca de sua senha. Sua nova senha é: ${novaSenha} `
                        })
                        return res.status(200).json({Message: 'Email Enviado.'})
                    }
            })
                
    } // Fim da funçao que recupera senha

    loadData(req, res){ // Carregar informaçõe do usuario
        const id = req.params.id
        db.query(`SELECT * FROM enderecos INNER JOIN pessoa_fisica ON enderecos.fk_id_fisicas = pessoa_fisica.id WHERE fk_id_fisicas = '${id}';`,
        function(err, rows){
            try {
                for(var row in rows){
                    res.status(200).json(rows[row])
                }
            } catch (error) {
                return console.log(error)
            }
        })
    } // Fim da função LoadData()

    updatePassword(req, res){ // Função para alterar de senha
        const {senhaAtual, novaSenha, id} = req.body

            db.query(`SELECT * FROM pessoa_fisica WHERE id = '${id}'`,
            async function(err, rows){
                for(let row in rows){
                    const senhaValidation = await bcrypt.compare(senhaAtual, rows[row].senha)
                    if(senhaValidation){
                        // BCrypt - Encripitando a senha
                        const salt = await bcrypt.genSalt(10);
                        const senha = await bcrypt.hash(novaSenha, salt);
                        db.query(`UPDATE pessoa_fisica SET senha = '${senha}' WHERE id = '${id}'`,
                        function(err){
                            if(err){
                                return console.log(err)
                            }else{
                                return res.status(200).json({Message: 'Senha Alterada.'})
                            }
                        })
                    }else{
                        res.status(400).json({error: 'Senha não confere'})
                    }
                }
            })
        
    } // Fim da função de alterar senhar

}

module.exports = new pf_controller()