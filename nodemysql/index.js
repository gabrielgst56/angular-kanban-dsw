	const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');

	
//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando!');


function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'admin',
    password : 'admin',
    database : 'dsw'
  });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('executou!');
  });
}

router.get('/task', (req, res) =>{
    console.log('All Tasks!');
    execSQLQuery('SELECT * FROM Task', res);
})


router.get('/task/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE ID=' + parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Task' + filter, res);
})

router.delete('/task/:id', (req, res) =>{
    execSQLQuery('DELETE FROM Task WHERE ID=' + parseInt(req.params.id), res);
})

router.post('/task', (req, res) =>{
    console.log('Adicionou!');
    const name = req.body.name.substring(0,150);
    const percentage = parseInt(req.body.percentage);
    execSQLQuery(`INSERT INTO Task(name, percentage) VALUES('${name}','${percentage}')`, res);
});

router.patch('/task/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const name = req.body.name.substring(0,150);
    const percentage = parseInt(req.body.percentage);
    execSQLQuery(`UPDATE Task SET name='${name}', percentage='${percentage}' WHERE ID=${id}`, res);
})