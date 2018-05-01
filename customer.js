var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var orderTotal = 0;

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
        });

        for (var i = 0; i < res.length; i++) {
            var boutiqueArray = [];
            boutiqueArray.push(res[i].id, res[i].product_name, res[i].category, "$" + res[i].price.toFixed(2), res[i].stock_quantity);
            table.push(boutiqueArray);
        }

        console.log(table.toString());
        placeOrder();
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
                        function (error) {
                            if (error) throw errow;
                            orderTotal += parseFloat(total);
                            console.log("Your item total comes to: $" + total);
                            newOrder();
                        }
                    )
                }
                else {
                    console.log("Oh no! We don't have enough items to fulfill your order.");
                    newOrder();
                }
            });
    });
};

function newOrder() {
    inquirer
        .prompt([
            {
                name: "new_order",
                type: "confirm",
                message: "Do you want to place another order?",
                default: false
            }
        ])
        .then(function (answer) {
            if (answer.new_order) {
                placeOrder();
            }
            else {
                console.log("Thanks for shopping at Bash Boutique!\n\nYour order total comes to: $" + parseFloat(orderTotal).toFixed(2));
                connection.end();
            }
        })
}