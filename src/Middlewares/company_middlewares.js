const db = require('../Database/db')


class pj_middlewares {

    async validationRegister(req, res, next){
        const {email, phone} = req.body
        
            db.query(`SELECT email FROM companies WHERE email = '${email}'`,
            function(err, rows){ // Verifica se existe email cadastrado
                try {
                    if(rows.length >= 1){
                        res.status(400).json({Message: 'Existe um cadastro com esse email'})
                    }else{
                        db.query(`SELECT phone FROM companies WHERE phone = '${phone}'`,
                            function(err, rows){ // Verifica se existe phone cadastrado
                                try {
                                    if(rows.length >= 1){
                                        res.status(400).json({Message: 'Existe um cadastro com esse phone'})
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