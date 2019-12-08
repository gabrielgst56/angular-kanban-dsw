npm install

Banco mysql usuário:
user     : 'admin'
password : 'admin'

Banco mysql command:
create database dsw;
use dsw;

CREATE TABLE IF NOT EXISTS User(ID int NOT NULL AUTO_INCREMENT, email varchar(150) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY (ID));
CREATE TABLE IF NOT EXISTS Task(ID int NOT NULL AUTO_INCREMENT, name varchar(150) NOT NULL, percentage int(3) NOT NULL, fk_User int NOT NULL, PRIMARY KEY (ID), FOREIGN KEY(fk_User) references User(ID));

Terminal #1 commands:
node nodemysql/index

Terminal #2 commands:
npm start