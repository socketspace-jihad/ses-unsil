// src/dbConfig.js
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'socketspace.com',
  user: 'root',
  password: 'programmer21',
  database: 'smart_exam_system',
};

let connection;

export async function initializeDatabase() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
}

export function getConnection() {
  console.log(connection)
  if (!connection) {
    throw new Error('Database not initialized');
  }
  return connection;
}