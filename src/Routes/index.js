const express = require('express')
const routes = express.Router()

//Controllers
const pf_controller = require('../Controllers/pf_controller')
const pj_controller = require('../Controllers/pj_controller')


//Middleares
const pf_middlewares = require('../Middlewares/pf_middlewares')
const pj_middlewares = require('../Middlewares/pj_middlewares')

routes.post('/cadastroFisica', pf_middlewares.validationCadastro, pf_controller.create)
routes.post('/cadastroJuridica', pj_middlewares.validationCadastro, pj_controller.create)
routes.post('/login', pf_middlewares.validationExitsEmail, pf_controller.login)
routes.put('/emailSenha', pf_middlewares.validationExitsEmail, pf_controller.emailPassword);
routes.put('/updateSenha', pf_middlewares.validationId ,pf_controller.updatePassword)
routes.get('/info/:id', pf_controller.loadData)
routes.get('/filter/:search', pj_controller.loadList)


module.exports = routes