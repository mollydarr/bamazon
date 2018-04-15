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
            message: "Would you like to view products (view_product), view low inventory (view_low_inventory,) add inventory(add_inventory),  or add a new product (add_product)?",
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

function viewProduct(){

}

function lowInventory(){

}

function addInventory(){

}

function addProduct(){

}
