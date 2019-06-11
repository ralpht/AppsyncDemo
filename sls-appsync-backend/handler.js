"use strict";

const { Client } = require("pg");

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 5432
};

exports.graphql = async (event, context, callback) => {
  // CREATE TABLE todos (id SERIAL PRIMARY KEY, name VARCHAR(255), description TEXT)

  const client = new Client(dbConfig);

  switch (event.field) {
    case "todos": {
      await client.connect();

      const res = await client.query("SELECT * FROM todos");

      await client.end();

      return callback(null, res.rows);
    }

    case "createTodo": {
      await client.connect();

      const { name, description = "" } = event.arguments.input;

      const res = await client.query(
        "INSERT INTO todos (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
      );

      await client.end();

      return callback(null, res.rows[0]);
    }

    default: {
      return callback(`Unknown field, unable to resolve ${event.field}`, null);
    }
  }
};
