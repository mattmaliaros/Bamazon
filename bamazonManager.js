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
    console.log(this);
}

function addInventory() {
    console.log(this);
}

function addProducts() {
    console.log(this);
}
function confirm(){
    inquirer.prompt([{
      type: "input",
      name: "askForConfirm",
      message: "Would you like to return to the original screen?"
    }]).then(function (responses){
      if (responses.askForConfirm.trim().toLowerCase() == "y"){
        createTable();
      }
      else if (responses.askForConfirm.trim().toLowerCase() == "n"){
        process.exit();
      }
      else {
        console.log("Incorrect input");
        confirm();
      }
    })
  }