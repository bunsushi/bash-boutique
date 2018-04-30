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
                console.log("Viewing products for sale...");
                displayStock();
            }
            if (answer.menu === "View Low Inventory") {
                console.log("Viewing low inventory...")
                displayLowInventory();
            }
            if (answer.menu === "Add to Inventory") {
                console.log("Adding to inventory...")
                addInventory();
            }
            if (answer.menu === "Add New Product") {
                console.log("Adding a new product...");
                addProduct();
            }
        })
};

function displayStock() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['ID', 'Product', 'Category', 'Price', 'Available']
        });

        for (var i = 0; i < res.length; i++) {
            var boutiqueArray = [];
            boutiqueArray.push(res[i].id, res[i].product_name, res[i].category, "$" + res[i].price.toFixed(2), res[i].stock_quantity);
            table.push(boutiqueArray);
        }

        console.log(table.toString());
        backToMenu();
    });
};

function displayLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['ID', 'Product', 'Category', 'Price', 'Available']
        });

        for (var i = 0; i < res.length; i++) {
            var boutiqueArray = [];
            if (res[i].stock_quantity <= 5) {
                boutiqueArray.push(res[i].id, res[i].product_name, res[i].category, "$" + res[i].price.toFixed(2), res[i].stock_quantity);
                table.push(boutiqueArray);
            }
        }

        console.log(table.toString());
        backToMenu();
    });
};

function addInventory() {
    console.log("beep");
    backToMenu();
};

function addProduct() {
    console.log("boop");
    backToMenu();
};

function backToMenu() {
    inquirer
        .prompt([
            {
                name: "back_to_menu",
                type: "confirm",
                message: "Back to menu?",
                default: true
            }
        ])
        .then(function (answer) {
            if (answer.back_to_menu) {
                managerMenu();
            }
            else {
                console.log("Closing up...");
                connection.end();
            }
        })
}