const express = require('express')
const routes = express.Router()

//Controllers
const company_controller = require('../Controllers/company_controller')


//Middleares
const company_middlewares = require('../Middlewares/company_middlewares')


routes.post('/registerCompany', company_middlewares.validationRegister, company_controller.create)
routes.get('/filter/:search',company_controller.loadList)


module.exports = routes