const mysql = require('mysql2');

const connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : 'Policia#0',
  database : 'BuscaLocal'
});

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('Conectado ao  Mysql!');
})

module.exports = connection