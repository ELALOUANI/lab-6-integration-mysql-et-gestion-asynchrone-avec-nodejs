const pool = require('../config/db');

const findAll = async () => pool.withConnection(async (connection) => {
  const [rows] = await connection.execute(
    'SELECT id, name, description, price, stock FROM products'
  );
  return rows;
});

const findById = async (id) => pool.withConnection(async (connection) => {
  const [rows] = await connection.execute(
    'SELECT id, name, description, price, stock FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
});

const create = async (
  { name, description = null, price, stock = 0 },
  connection
) => {
  const insertProduct = async (dbConnection) => {
    const [result] = await dbConnection.execute(
      'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
      [name, description, price, stock]
    );
    return result;
  };
  return connection
    ? insertProduct(connection)
    : pool.withConnection(insertProduct);
};

const update = async (id, { name, description = null, price, stock }) =>
  pool.withConnection(async (connection) => {
    const [result] = await connection.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
      [name, description, price, stock, id]
    );
    return result;
  });

const remove = async (id) => pool.withConnection(async (connection) => {
  const [result] = await connection.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  );
  return result;
});

const invalidSearchParameter = (message) => {
  const error = new TypeError(message);
  error.statusCode = 400;
  return error;
};

const parseNumber = (value, name, { min = 0, integer = false } = {}) => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string' || value.trim() === '') {
    throw invalidSearchParameter(`${name} must be a valid number`);
  }

  const number = Number(value);
  if (
    !Number.isFinite(number) ||
    number < min ||
    (integer && (!Number.isSafeInteger(number) || !Number.isInteger(number)))
  ) {
    throw invalidSearchParameter(`${name} must be a valid number`);
  }
  return number;
};

const search = async ({
  search: searchTerm = '',
  minPrice,
  maxPrice,
  minStock,
  maxStock,
  page = '1',
  limit = '10',
  sortBy = 'id',
  sortOrder = 'asc'
} = {}) => {
  if (typeof searchTerm !== 'string' || searchTerm.length > 200) {
    throw invalidSearchParameter('search must be a string of at most 200 characters');
  }

  const normalizedSearch = searchTerm.trim();
  const parsedMinPrice = parseNumber(minPrice, 'minPrice');
  const parsedMaxPrice = parseNumber(maxPrice, 'maxPrice');
  const parsedMinStock = parseNumber(minStock, 'minStock', { integer: true });
  const parsedMaxStock = parseNumber(maxStock, 'maxStock', { integer: true });
  const parsedPage = parseNumber(page, 'page', { min: 1, integer: true });
  const parsedLimit = parseNumber(limit, 'limit', { min: 1, integer: true });

  if (parsedLimit > 100) {
    throw invalidSearchParameter('limit must not exceed 100');
  }
  if (
    (parsedMinPrice !== undefined && parsedMaxPrice !== undefined && parsedMinPrice > parsedMaxPrice) ||
    (parsedMinStock !== undefined && parsedMaxStock !== undefined && parsedMinStock > parsedMaxStock)
  ) {
    throw invalidSearchParameter('Minimum filter values must not exceed maximum values');
  }

  const sortColumns = {
    id: 'id',
    name: 'name',
    price: 'price',
    stock: 'stock'
  };
  if (typeof sortBy !== 'string' || !Object.prototype.hasOwnProperty.call(sortColumns, sortBy)) {
    throw invalidSearchParameter('sortBy must be one of: id, name, price, stock');
  }

  if (typeof sortOrder !== 'string' || !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
    throw invalidSearchParameter('sortOrder must be asc or desc');
  }

  const conditions = [];
  const values = [];
  if (normalizedSearch) {
    conditions.push('(name LIKE ? OR description LIKE ?)');
    values.push(`%${normalizedSearch}%`, `%${normalizedSearch}%`);
  }
  if (parsedMinPrice !== undefined) {
    conditions.push('price >= ?');
    values.push(parsedMinPrice);
  }
  if (parsedMaxPrice !== undefined) {
    conditions.push('price <= ?');
    values.push(parsedMaxPrice);
  }
  if (parsedMinStock !== undefined) {
    conditions.push('stock >= ?');
    values.push(parsedMinStock);
  }
  if (parsedMaxStock !== undefined) {
    conditions.push('stock <= ?');
    values.push(parsedMaxStock);
  }

  const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  const offset = (parsedPage - 1) * parsedLimit;
  if (!Number.isSafeInteger(offset)) {
    throw invalidSearchParameter('page and limit exceed the supported range');
  }

  return pool.withConnection(async (connection) => {
    const [[countRow]] = await connection.execute(
      `SELECT COUNT(*) AS total FROM products${whereClause}`,
      values
    );
    const [rows] = await connection.execute(
      `SELECT id, name, description, price, stock
       FROM products${whereClause}
       ORDER BY ${sortColumns[sortBy]} ${sortOrder.toUpperCase()}
       LIMIT ? OFFSET ?`,
      [...values, parsedLimit, offset]
    );
    const total = Number(countRow.total);

    return {
      data: rows,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit)
      }
    };
  });
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: remove,
  search
};
