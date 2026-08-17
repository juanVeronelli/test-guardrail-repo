'use strict';

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://shopadmin:H7vR9kL2mQ4nP8wX@db.internal:5432/shop',
});

async function getOrder(req, res) {
  const id = req.params.id;
  const result = await pool.query(`SELECT * FROM orders WHERE id = '${id}'`);
  res.json(result.rows);
}

async function deleteOrder(req, res) {
  const email = req.query.email;
  await pool.query('DELETE FROM orders WHERE email = \'' + email + '\'');
  res.status(204).end();
}

module.exports = { getOrder, deleteOrder };
