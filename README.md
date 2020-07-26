# PROJECT (WITH NEW TOOLS)
NUSCommunity 
 
 # SET UP TO LAUNCH PROJECT
+ Install Node at link: https://nodejs.org/en/download/
+ Download MySQL(server) at https://dev.mysql.com/downloads/ + MySQLWorkbench(environment) at https://dev.mysql.com/downloads/workbench/

+ Set up MySQL server inside MySQLWorkbench:  
_ If you have an available server already, go updating your server data in .env file (at root folder).  
_ If not, run this command in MySQLWorkbench: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'duynguyen24501';`

+ Create relational tables in MySQL database:  
_ Check out all MySQL commands to create database/tables inside folder named 'database'.  
_ Copy, paste the command code and run in your MySQLWorkbench server in order:
1. createDB.sql
2. userTable.sql
3. keepTable.sql
4. postTable.sql
5. hashtagTable.sql, reactTable.sql, commentTable.sql in any order

+ Choose your favorite IDE and clone this project

+ Type command `npm install` to install necessary modules/dependencies at two directories:  
_ At root directory. </br>
_ At client directory. </br>

+ To launch the project, type following commands at two separate terminals at the same time:  
_ At root directory: `node server` or `nodemon server` to start backend server. </br>
_ At client directory: `npm start` to start react server. </br>

 # TESTING
 The testing files are put at client/src/test.  
 To run testing, go inside client directory, type command: `npm test`

