const pool = require('../config/db');

const runWithConnection = (connection, callback) =>
  connection ? callback(connection) : pool.withConnection(callback);

const findAll = async () => pool.withConnection(async (connection) => {
  const [rows] = await connection.execute(
    'SELECT id, name FROM categories'
  );
  return rows;
});

const findById = async (id, connection) =>
  runWithConnection(connection, async (dbConnection) => {
    const [rows] = await dbConnection.execute(
      'SELECT id, name FROM categories WHERE id = ?',
      [id]
    );
    return rows[0];
  });

const findByName = async (name, connection) =>
  runWithConnection(connection, async (dbConnection) => {
    const [rows] = await dbConnection.execute(
      'SELECT id, name FROM categories WHERE name = ? LIMIT 1 FOR UPDATE',
      [name]
    );
    return rows[0];
  });

const create = async ({ name }, connection) =>
  runWithConnection(connection, async (dbConnection) => {
    const [result] = await dbConnection.execute(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );
    return result;
  });

const update = async (id, { name }) => pool.withConnection(async (connection) => {
  const [result] = await connection.execute(
    'UPDATE categories SET name = ? WHERE id = ?',
    [name, id]
  );
  return result;
});

const deleteCategory = async (id) => pool.withConnection(async (connection) => {
  const [result] = await connection.execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  return result;
});

const addProduct = async (categoryId, productId, connection) =>
  runWithConnection(connection, async (dbConnection) => {
    const [result] = await dbConnection.execute(
      'INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)',
      [productId, categoryId]
    );
    return result;
  });

const removeProduct = async (categoryId, productId) =>
  pool.withConnection(async (connection) => {
    const [result] = await connection.execute(
      'DELETE FROM product_categories WHERE category_id = ? AND product_id = ?',
      [categoryId, productId]
    );
    return result;
  });

const findProducts = async (categoryId) =>
  pool.withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT p.id, p.name, p.description, p.price, p.stock
       FROM products AS p
       INNER JOIN product_categories AS pc ON pc.product_id = p.id
       WHERE pc.category_id = ?`,
      [categoryId]
    );
    return rows;
  });

module.exports = {
  findAll,
  findById,
  findByName,
  create,
  update,
  delete: deleteCategory,
  addProduct,
  removeProduct,
  findProducts
};