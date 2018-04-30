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
            boutiqueArray.push(res[i].id, res[i].product_name, res[i].category, "$" + res[i].price.toFixed(2), res[i].stock_quantity);
            table.push(boutiqueArray);
        }

        console.log(table.toString());

        placeOrder();

        // connection.end();
    });
};

function placeOrder() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "item",
                    type: "list",
                    pageSize: 11,
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "What item are you interested in?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units would you like to purchase?"
                }
            ])
            .then(function (answer) {
                console.log(answer.item + " " + answer.quantity);

                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.item) {
                        chosenItem = res[i];
                    }
                }

                var total = (chosenItem.price * answer.quantity).toFixed(2);

                if (answer.quantity <= chosenItem.stock_quantity) {
                    // update quantity in sql
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: chosenItem.stock_quantity - answer.quantity
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function(error) {
                            if (error) throw errow;
                            console.log("Your total is: $" + total);
                            // Function: do you want to place another order?
                        }
                    )
                }
                else {
                    // Function: do you want to place another order?
                    console.log("Woops! We don't have enough items to fulfill your order.");
                }
            });
    });
};