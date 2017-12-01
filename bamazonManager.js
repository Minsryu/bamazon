var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');


var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"bamazon",

});

connection.connect(function(err){
	if(!err){
		displayChoices();
	}
});

var displayChoices = function(){
	inquirer.prompt(
	[{
		name:"choice",
		message:"What would you like to do?",
		type:"list",
		choices:["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]

	}]).then(function(res){
	
		switch(res.choice){
			case "View Products for Sale" :
				viewProducts();
				break;

			case "View Low Inventory" :
				viewInventory();
				break;

			case "Add to Inventory" :
				addInventory();
				break;

			case "Add New Product" :
				newProduct();
				break;

		}
	})
}

var viewProducts = function(){

	connection.query("SELECT * FROM products;",function(err,res){

	var t = new Table;
	console.log("\n");
	res.forEach(function(product){
		t.cell('Id',product.item_id)
		t.cell("Product", product.product_name)
		t.cell("Department", product.department_name)
		t.cell("Price", product.price_customer,Table.number(2))
		t.cell("Quantity", product.stock_quantity,Table.number(0))
		t.newRow()
	});

	console.log(t.toString());
	displayChoices();
		
	});
}

var viewInventory = function(){

	connection.query("SELECT * FROM products WHERE stock_quantity <= 5;",function(err,res){

	var t = new Table;
	console.log("\n");
	res.forEach(function(product){
		t.cell('Id',product.item_id)
		t.cell("Product", product.product_name)
		t.cell("Department", product.department_name)
		t.cell("Price", product.price_customer,Table.number(2))
		t.cell("Quantity", product.stock_quantity,Table.number(0))
		t.newRow()
	});

	console.log(t.toString());
	displayChoices();
		
	});

}

var addInventory = function(){
		inquirer.prompt(
	[{
		name:"id",
		message:"Enter ID of product you would like to stock",
		type:"input",
		validate: function(value){
			if(isNaN(value)===false ){
				return true;
			}
			return false;
		}

	},{
		name:"quantity",
		message:"how many do you want to stock?",
		type:"input",
		validate: function(value){
			if(isNaN(value)===false && value >0){
				return true;
			}
			return false;
		}

	}]).then(function(res){

		stockInventory(res.id,res.quantity);

	})
}

var stockInventory = function(id,quantity){

	connection.query("SELECT * FROM products WHERE item_id=?",[id],function(err,res){
	
		if(res[0] === undefined){
			console.log("\n/////////////////////////////////");
			console.log("Sorry that Item does not exsist, please check list again");
			console.log("/////////////////////////////////");
			displayChoices();
		}
		else{
			var inStock = res[0].stock_quantity;
			var newStock = parseInt(inStock) + parseInt(quantity);

			connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[newStock,id],function(err,res){
				// console.log(res);
			console.log("\n/////////////////////////////////");
			console.log("Stock has been update! Total stock is now "+newStock);
			console.log("\n/////////////////////////////////");
			displayChoices();

			});
		} 

	});
}

var newProduct = function(){
	inquirer.prompt([{
		name:"name",
		message:"What is the name of product?",
		type:"input"
	},{
		name:"department",
		message:"What is the department of product?",
		type:"input"
	},{
		name:"price",
		message:"What is the price of product?",
		type:"input",
		validate: function(value){
			if(isNaN(value)===false && value >0){
				return true;
			}
			return false;
		}
	},{
		name:"stock",
		message:"What is the current stock?",
		type:"input",
		validate: function(value){
			if(isNaN(value)===false && value >0){
				return true;
			}
			return false;
		}
	}]).then(function(res){

		connection.query("INSERT INTO products SET?",{
			product_name:res.name,
			department_name:res.department,
			price_customer:res.price,
			stock_quantity:res.stock
		},function(err,res){
			console.log("\n/////////////////////////////////");
			console.log("Product has been added!")
			console.log("/////////////////////////////////");
			displayChoices();
		})
		;
	})
}

