const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

let db;

// Verifica se está em produção (Vercel) ou desenvolvimento
if (process.env.NODE_ENV === 'production') {
    // Configuração para PostgreSQL (Vercel)
    db = new Pool({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    // Configuração para SQLite (desenvolvimento local)
    db = new sqlite3.Database(path.join(__dirname, 'carros.db'), (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados SQLite:', err);
        } else {
            console.log('Conectado ao banco de dados SQLite');
        }
    });
}

module.exports = db; 