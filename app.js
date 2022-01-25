const express = require('express');
const cors = require('cors');
require('dotenv').config()

const Pool = require('pg').Pool;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false
  },


  // user: 'postgres',
  // password: 'postgres',
  // host: 'localhost',
  // port: 5432,
  // database: 'journal',
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  //   res.status(201).send('<h1>hello world</h1>');
  res.send({ info: 'Journal Api app' });
});

app.get('/categories', (req, res) => {
  pool.query('select * from public.categories', (error, results) => {
    res.send(error ? { error: error.message } : results.rows);
  });
});

app.get('/entries', (req, res) => {
  pool.query('select * from entries', (err, results) => {
    res.send(err ? { error: err.message } : results.rows);
  });
});
app.get('/entries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('select * from entries where id = $1', [id], (err, results) => {
    if (err) res.status(422).send({ error: err.message });
    if (results.rows.length == 0) res.send({ error: 'Entry not found' });
    res.send.rows[0];
  });
});

app.post('/entries', (req, res) => {
  const { content, cat_id } = req.body;
  pool.query(
    'insert into entries (content, category_id) values ($1, $2) returning *',
    [content, cat_id],
    (err, results) => {
      if (err) res.status(422).send({ error: err.message });
      res.send(results.rows[0]);
    }
  );
});

module.exports = app;
