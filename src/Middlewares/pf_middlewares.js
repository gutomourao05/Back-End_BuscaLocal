const db = require('../Database/db')

class pf_middlewares {

    async validationCadastro(req, res, next){
        const {email, celular} = req.body

        
            db.query(`SELECT email, celular FROM pessoa_fisica WHERE email = '${email}'`,
            function (err, rows) {
                try {
                    if (rows.length >= 1) {
                        res.status(400).json({ Message: 'Existe um cadastro com esse email' })
                    } else {
                        db.query(`SELECT * FROM pessoa_fisica WHERE celular = '${celular}'`,
                            function (err, rows) {
                                try {
                                    if (rows.length >= 1) {
                                        res.status(400).json({ Message: 'Existe um cadastro com esse Celular' })
                                    } else {
                                        next()
                                    }
                                } catch (error) {
                                    console.log(error)
                                }
                            })
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            
        
    } // Fim validationCadastro()

    async validationExitsEmail(req, res, next){ // Verificando se existe email cadastrado
        const { email } = req.body
        
            db.query(`SELECT email, senha FROM pessoa_fisica WHERE email = '${email}'`,
            function(err, rows){
                try {
                    if(rows.length >= 1){
                        next()
                    }else {
                        res.status(400).json({Message: 'Email não cadastrado'})
                    }
                } catch (error) {
                    console.log(error)
                }
            })

    }

    async validationId(req, res, next){
        const { id } = req.body
        db.query(`SELECT * FROM pessoa_fisica WHERE id = '${id}'`,
        function(err, rows){
            if(rows.length >= 1){
                next()
            }else{
                res.status(400).json({Error: 'Faça Login Novamente'})
            }
        })
    }
    
}

module.exports = new pf_middlewares()