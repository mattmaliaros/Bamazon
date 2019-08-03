var inquirer = require("inquirer");
var mysql = require('mysql');
var http = require("http");

// var PORT = 8080;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "newuser",
    password: "user_password",
    database: "Bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    console.log("==================Welcome Manager==================")
    runInquirer();
});



function runInquirer() {
    inquirer.prompt([{
        type: "list",
        name: "askManager",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (responses) {
        console.log(responses.askManager);
        let temp = responses.askManager;

        switch (temp) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProducts();
                break;
            default:
                break;
        }
    })
}

function viewProducts() {
    connection.query("Select item_id, product_name, price, stock_quantity  from products", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Here are the products listed for purchase.")
        console.log("===========================================================================================");
        confirm();
    });
}

function viewInventory() {
    connection.query("Select item_id, product_name, price, stock_quantity from products where stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Here are the products with low inventory status");
        console.log("===========================================================================================");
        confirm();
    })
}

function addInventory() {
    inquirer.prompt([{
                type: "input",
                name: "askForName",
                message: "What item would you like to add inventory to?"
            },

            {
                type: "input",
                name: "askForQuantity",
                message: "How many of these would you like to add?"
            }
        ])
        .then(function (responses) {
            checkQty(responses.askForName, responses.askForQuantity);
        })
}

function checkQty(name, qty) {
    // console.log("SELECT * FROM products where product_name = 'watch'");
    if (qty == 0) {
        console.log("0 Quantity selected, please try again.");
        runInquirer();
    } else if (qty > 0) {
        connection.query("SELECT * FROM products where product_name = '" + name + "'", function (err, res) {
            if (err) throw err;
            var tableQty = res[0].stock_quantity;
            updateQty(qty, tableQty, name);
        })
    } else {
        console.log("Insufficient Quantity, please try again");
        confirm();
    }
}


function updateQty(qty, tQty, name) {
    tQty = parseInt(tQty);
    qty = parseInt(qty);
    let newQty = tQty + qty;
    console.log("Processing your order");
    console.log("=============================================");
    connection.query("Update products set stock_quantity = " + newQty + " where product_name = '" + name + "'", function (err, res) {
        if (err) throw err;
        console.log("Quantity updated.  Thank you for your submission.");
    })
    connection.query("Select * from products where product_name = '" + name + "'", function (err, res) {
        if (err) throw err;
        console.table(res);
        confirm();
    })
}

function addProducts() {
    inquirer.prompt([{
            type: "input",
            name: "askForName",
            message: "What item would you like to add into the system?"
        }, {
            type: "input",
            name: "askForDept",
            message: "What department does this product fall under?"
        },
        {
            type: "input",
            name: "askForPrice",
            message: "What is the price of this item?"
        },
        {
            type: "input",
            name: "askForQty",
            message: "How many of this item do we have?"
        }
    ]).then(function (responses) {
        insertInto(responses.askForName, responses.askForDept, responses.askForPrice, responses.askForQty);
    })
}

function insertInto(name, dept, price, qty) {
    var insertQuery;
    insertQuery = "Insert into products (product_name, dept_name, price, stock_quantity)";
    insertQuery += " values('" + name + "', '" + dept + "', '" + price + "', '" + qty + "')";
    connection.query(insertQuery, function (err, res) {
        if (err) throw err;
        console.log(res);
        confirm();
    })
}

function confirm() {
    inquirer.prompt([{
        type: "input",
        name: "askForConfirm",
        message: "Would you like to return to the original screen?"
    }]).then(function (responses) {
        if (responses.askForConfirm.trim().toLowerCase() == "y") {
            runInquirer();
        } else if (responses.askForConfirm.trim().toLowerCase() == "n") {
            process.exit();
        } else {
            console.log("Incorrect input");
            confirm();
        }
    })
}