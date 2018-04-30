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
    displayStock();
});

function displayStock() {
    console.log("Welcome to Bash Boutique! Here's what's in store:");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['ID', 'Product', 'Category', 'Price', 'Available']
            //, colWidths: [100, 200]
        });

        for (var i = 0; i < res.length; i++) {
            var boutiqueArray = [];
            boutiqueArray.push(res[i].id);
            boutiqueArray.push(res[i].product_name);
            boutiqueArray.push(res[i].category);
            // Fix so reads to 2 decimals
            boutiqueArray.push(res[i].price);
            boutiqueArray.push(res[i].stock_quantity);
            table.push(boutiqueArray);
        }

        console.log(table.toString());

        connection.end();
    });
}