DROP DATABASE IF EXISTS boutique_db;
CREATE DATABASE boutique_db;

USE boutique_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  category VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, category, price, stock_quantity)
VALUES ("silver dinglehopper", "gadget", 2.99, 5),
("alarm clock", "gadget", 9.99, 11),
("music box", "gizmo", 49.49, 4),
("jack-in-the-box", "gizmo", 66.60, 2),
("golden harp", "gizmo", 6780.90, 6),
("golden goblet", "whozit", 33.98, 20),
("nickel mirror", "whozit", 18.97, 8),
("marble statue", "whozit", 359.20, 1),
("brass bird cage", "whatzit", 24.50, 3),
("book", "whatzit", 11.96, 97);

SELECT * FROM products;
