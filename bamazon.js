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
  createTable();
});

// var server = http.createServer(handleRequest);
// server.listen(PORT, function () {
//   // Log (server-side) when our server has started
//   console.log("Server listening on: http://localhost:" + PORT);
// });

// function handleRequest(req, res) {
//   res.end("It works");
// }

function createTable() {
  connection.query("Select * from products", function (err, res) {
    if (err) throw err;
    console.table(res);
    console.log("==================Welcome Customer==================")
    runInquirer();
  });
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
      let cost = res[0].price;
      let totalCost = qty * cost;
      if (qty <= tableQty) {
        updateQty(qty, tableQty, name, totalCost);
      } else {
        console.log("Insufficient Quantity, please try again");
        confirm();
      }
    })
  } else {

  }
}

function updateQty(qty, tQty, name, cost) {
  tQty = parseInt(tQty);
  qty = parseInt(qty);
  let newQty = tQty - qty;
  console.log("Processing your order");
  console.log("=============================================");
  connection.query("Update products set stock_quantity = " + newQty + " where product_name = '" + name + "'", function (err, res) {
    if (err) throw err;
    console.log("Product purchase confirmed.");
    console.log("Total cost of purchase is: $" + cost);
    confirm();
  })
}

function runInquirer() {
  inquirer.prompt([{
        type: "input",
        name: "askForName",
        message: "What item would you like to buy?"
      },

      {
        type: "input",
        name: "askForQuantity",
        message: "How many of these would you like?"

      }
    ])
    .then(function (responses) {
      checkQty(responses.askForName, responses.askForQuantity);
    })
}

function confirm() {
  inquirer.prompt([{
    type: "input",
    name: "askForConfirm",
    message: "Would you like to return to the original screen?"
  }]).then(function (responses) {
    if (responses.askForConfirm.trim().toLowerCase() == "y") {
      createTable();
    } else if (responses.askForConfirm.trim().toLowerCase() == "n") {
      process.exit();
    } else {
      console.log("Incorrect input");
      confirm();
    }
  })
}