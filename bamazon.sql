create database Bamazon;
use Bamazon;
create table products(
item_id int(10) not null auto_increment,
product_name varchar(25),
dept_name varchar(25),
price int(10),
stock_quantity int(10)
);
insert into products(product_name, dept_name, price, stock_quantity)
values("watch", "jewelery", 300, 10),
("computer", "electronics", 1000, 20),
("television", "electronics", 500, 2),
("shirt", "clothing", 25, 50),
("shorts", "clothing", 20, 90),
("necklace", "jewelery", 100, 30),
("frozen pizza", "food", 20, 100),
("gatorade", "food", 2, 500),
("earrings", "jewelery", 30, 50),
("phone", "electronics", 600, 10);