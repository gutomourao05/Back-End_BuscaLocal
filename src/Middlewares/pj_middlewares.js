const db = require('../Database/db')


class pj_middlewares {

    validationCadastro(req, res, next){
        const {email, celular} = req.body
        
            db.query(`SELECT email, celular FROM pessoa_juridica WHERE email = '${email}'`,
            function(err, rows){ // Verifica se existe email cadastrado
                try {
                    if(rows.length >= 1){
                        res.status(400).json({Message: 'Existe um cadastro com esse email'})
                    }else{
                        db.query(`SELECT * FROM pessoa_juridica WHERE celular = '${celular}'`,
                            function(err, rows){ // Verifica se existe celular cadastrado
                                try {
                                    if(rows.length >= 1){
                                        res.status(400).json({Message: 'Existe um cadastro com esse Celular'})
                                    }else{
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

}

module.exports = new pj_middlewares()