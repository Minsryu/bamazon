CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(

	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price_customer DECIMAL (10,2),
    stock_quantity INT,
    PRIMARY KEY(item_id)
)

SELECT *FROM products;

INSERT INTO products(product_name,department_name,price_customer,stock_quantity)
VALUES ("boxK","home",100.20,60);