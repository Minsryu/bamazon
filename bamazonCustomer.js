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
		displayItems();
	}
});

var displayItems = function(){
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

		selectItems();
	});
}

var selectItems = function(){
	inquirer.prompt(
	[{
		name:"id",
		message:"Enter ID of product you would like to buy",
		type:"input",
		validate: function(value){
			if(isNaN(value)===false){
				return true;
			}
			return false;
		}

	},{
		name:"quantity",
		message:"how many do you want to buy?",
		type:"input",
		validate: function(value){
			if(isNaN(value)===false && value >0){
				return true;
			}
			return false;
		}

	}]).then(function(res){

		purchaceItem(res.id,res.quantity);

	})
}




var purchaceItem = function(id,quantity){
	connection.query("SELECT * FROM products WHERE item_id=?",[id],function(err,res){
	
		if(res[0] === undefined){
			console.log("/////////////////////////////////");
			console.log("Sorry that Item does not exsist, please check list again");
			console.log("/////////////////////////////////");
			displayItems();
		}
		else{
			var inStock = res[0].stock_quantity;
			var price = res[0].price_customer;
			if(quantity > inStock ) {
			console.log("/////////////////////////////////");	
			console.log("Sorry we do not have that much in stock, please check list again");
			console.log("/////////////////////////////////");
			displayItems();
			}

			else{
				var newStock = parseInt(inStock) - parseInt(quantity);
				connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[newStock,id],function(err,res){
					// console.log(res);
					console.log("You have purchased! The total price is: $"+price*quantity );
					displayItems();
				});
			}
		} 

	});
}



// purchaceItem(11,10);









