const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');
const crypto = require("crypto");
const validator = require('email-validator');

	
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


const DADOS_CRIPTOGRAFAR = {
    algoritmo : "aes256",
    segredo : "chaves", 
    tipo : "hex"
};


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
  });
}

function criptografar(senha) {
    const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
    cipher.update(senha);
    return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
};

router.post('/register', (req, res) =>{
    const email = req.body.email;
    let password = req.body.password;
    
    let flag = validator.validate(email);
    if (flag){

        if (password.length >= 6){

            password = criptografar(password);
        
            execSQLQuery(`INSERT INTO User(email, password) VALUES('${email}','${password}')`, res);

        }else{
            res.json(false);
        }

    }else {
        res.json(false);
    }
});

router.post('/login', (req, res) =>{
    const email = req.body.email.substring(0,150);
    let password = req.body.password.substring(0, 255);

    password = criptografar(password);
    
    execSQLQuery(`SELECT * FROM User WHERE email = '${email}' AND password = '${password}'`, res);
});

router.get('/task', (req, res) =>{
    execSQLQuery('SELECT * FROM Task', res);
})


router.get('/task/:id?', (req, res) =>{
    let fk_User = parseInt(req.params.id);
    execSQLQuery('SELECT * FROM Task WHERE fk_User =' + fk_User, res);
})

router.delete('/task/:id', (req, res) =>{
    execSQLQuery('DELETE FROM Task WHERE ID= ' + parseInt(req.params.id), res);
})

router.post('/task', (req, res) =>{
    const name = req.body.name.substring(0,150);
    const percentage = parseInt(req.body.percentage);
    const fk_User = parseInt(req.body.fk_User);
    execSQLQuery(`INSERT INTO Task(name, percentage, fk_User) VALUES('${name}','${percentage}', '${fk_User}')`, res);
});

router.patch('/task/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const name = req.body.name.substring(0,150);
    const percentage = parseInt(req.body.percentage);
    execSQLQuery(`UPDATE Task SET name='${name}', percentage='${percentage}' WHERE ID=${id}`, res);
})