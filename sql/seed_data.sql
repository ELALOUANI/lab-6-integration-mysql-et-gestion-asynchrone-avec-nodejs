USE product_api;

INSERT IGNORE INTO categories (name)
VALUES ('Audio'), ('Accessories');

INSERT INTO products (name, description, price, stock)
SELECT 'Casque audio', 'Casque audio sans fil', 59.99, 20
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Casque audio'
);

INSERT INTO products (name, description, price, stock)
SELECT 'Clavier mécanique', 'Clavier mécanique compact', 89.99, 15
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE name = 'Clavier mécanique'
);

INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT products.id, categories.id
FROM products
JOIN categories ON categories.name = 'Audio'
WHERE products.name = 'Casque audio';

INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT products.id, categories.id
FROM products
JOIN categories ON categories.name = 'Accessories'
WHERE products.name = 'Clavier mécanique';
