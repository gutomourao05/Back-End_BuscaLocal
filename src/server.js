const express = require('express')
const server = express()
const cors = require('cors')

//Rotas
const routes = require('./Routes/')

server.use(express.urlencoded({ extended:true }))
server.use(cors())
server.use(express.json())
server.use(routes)

const port = 3000

server.listen(port, () => {
    console.log(`Server connected to the port ${port}`)
})