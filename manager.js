var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "admin",
    database: "boutique_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    managerMenu();
    connection.end();
});

function managerMenu() {
    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                message: "What would you like to do?"
            }
        ])
        .then(function (answer) {
            if (answer.menu === "View Products for Sale") {
                console.log("Viewing products for sale...")
            }
            if (answer.menu === "View Low Inventory") {
                console.log("Viewing low inventory...")
            }
            if (answer.menu === "Add to Inventory") {
                console.log("Adding to inventory...")
            }
            if (answer.menu === "Add New Product") {
                console.log("Adding a new product...")
            }
        })
}