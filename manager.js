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
                    message: "For which item are you updating inventory?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units would you like to add?"
                }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.item) {
                        chosenItem = res[i];
                    }
                }

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: chosenItem.stock_quantity + parseFloat(answer.quantity)
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        connection.query("SELECT * FROM products WHERE id = ?", [chosenItem.id], function (err, res) {

                            var table = new Table({
                                head: ['ID', 'Product', 'Category', 'Price', 'Available']
                            });

                            for (var i = 0; i < res.length; i++) {
                                var updatedInventory = [];
                                updatedInventory.push(res[i].id, res[i].product_name, res[i].category, "$" + res[i].price.toFixed(2), res[i].stock_quantity);
                                table.push(updatedInventory);
                            }

                            console.log(table.toString());

                            console.log("Your item(s) were added successfully!");
                            backToMenu();
                        })
                    }
                );
            });
    });
}

function addProduct() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the product you would like to add?"
            },
            {
                name: "category",
                type: "input",
                message: "What category would you like to place your product in?"
            },
            {
                name: "price",
                type: "input",
                message: "What would you like the item price to be? (##.##)"
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "How many items would you like to add?"
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info

            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    category: answer.category,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function (err) {
                    if (err) throw err;

                    connection.query("SELECT * FROM products WHERE product_name = ?", [answer.item], function (err, res) {

                        var table = new Table({
                            head: ['ID', 'Product', 'Category', 'Price', 'Available']
                        });

                        for (var i = 0; i < res.length; i++) {
                            var updatedInventory = [];
                            updatedInventory.push(res[i].id, res[i].product_name, res[i].category, "$" + res[i].price.toFixed(2), res[i].stock_quantity);
                            table.push(updatedInventory);
                        }

                        console.log(table.toString());

                        console.log("Your product was created successfully!");
                        backToMenu();
                    })
                }
            );
        });
        });
}

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