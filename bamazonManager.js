var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "managerMenu",
            type: "rawlist",
            message: "Would you like to view products, view low inventory, add inventory,  or add a new product?",
            choices: ["view_product", "view_low_inventory", "add_inventory", "add_product"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.managerMenu === "view_product") {
                viewProduct();
            }
            else if (answer.managerMenu === "view_low_inventory") {
                lowInventory();
            } else if (answer.managerMenu === "add_inventory") {
                addInventory();
            } else if (answer.managerMenu === "add_product") {
                addProduct();
            } else {
                console.log("I'm sorry - that option is invalid");
                start();
            }
        });
}

function viewProduct() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // display all results of the SELECT statement in table
        console.table(res);
        connection.end();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        // display all results of the SELECT statement in table
        console.table(res);
        connection.end();
    });

}

function validation(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return "Please enter a valid number"
    }
}

function addInventory() {

    // query the database for all items for sale
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What item would you like to add inventory to (please indicate ID #)?",
                    validate: validation,
                    filter: Number
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "What is the new inventory total?",
                    validate: validation,
                    filter: Number
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem = answer.id;
                var inventoryQty = answer.quantity;

                var query = "SELECT * FROM products WHERE ?";

                connection.query(query, { id: chosenItem }, function (err, res) {
                    if (err) throw err;

                    if (res.length === 0) {
                        console.log("Please select a valid item ID");
                    } else {


                        var updateTable = "UPDATE products SET stock_quantity = " + inventoryQty + " WHERE id = " + chosenItem;

                        connection.query(updateTable, function (err) {
                            if (err) throw err;

                            console.log("Inventory added successfully.");
                            viewProduct();
                        });

                    }
                });
            })
    });
}




function addProduct() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the product you would like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What department is this product in?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the product?",
                validate: validation,
            },
            {
                name: "stock",
                type: "input",
                message: "How much stock do you have of this new product?",
                validate: validation,
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.stock
                },
                function (err) {
                    if (err) throw err;
                    console.log("The new product was successfully added.");
                    viewProduct();
                }
            );
        });
};
