const { Pool } = require('pg');

// Verificar se temos uma URL de PostgreSQL válida
const hasPostgresUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let pool = null;
let useSQLite = false;

if (hasPostgresUrl && hasPostgresUrl.includes('postgres')) {
  // Configuração do banco PostgreSQL
  pool = new Pool({
    connectionString: hasPostgresUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  console.log('🔗 Conectando ao PostgreSQL...');
} else {
  // Fallback para SQLite se não houver PostgreSQL configurado
  console.log('⚠️  PostgreSQL não configurado, usando SQLite como fallback...');
  useSQLite = true;
  
  // Importar SQLite dinamicamente
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  
  const sqliteDb = new sqlite3.Database(path.join(__dirname, 'carros.db'), (err) => {
    if (err) {
      console.error('Erro ao conectar ao SQLite:', err);
    } else {
      console.log('✅ Conectado ao banco de dados SQLite');
    }
  });

  // Criar tabelas SQLite
  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS listas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      data_criacao TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  sqliteDb.run(`
    CREATE TABLE IF NOT EXISTS carros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lista_id INTEGER NOT NULL,
      marca TEXT,
      modelo TEXT,
      ano TEXT,
      valor REAL,
      classificacao TEXT,
      data_consulta TEXT,
      FOREIGN KEY (lista_id) REFERENCES listas (id)
    )
  `);

  // Inserir listas padrão se não existirem
  sqliteDb.run(`
    INSERT OR IGNORE INTO listas (id, nome) VALUES 
    (1, 'Carros que posso ter'),
    (2, 'Carros que já tive')
  `);

  // Criar pool simulado para SQLite
  pool = {
    query: (text, params = []) => {
      return new Promise((resolve, reject) => {
        // Converter placeholders PostgreSQL para SQLite
        const sqliteQuery = text.replace(/\$(\d+)/g, '?');
        
        if (text.trim().toUpperCase().startsWith('SELECT')) {
          sqliteDb.all(sqliteQuery, params, (err, rows) => {
            if (err) reject(err);
            else resolve({ rows });
          });
        } else {
          sqliteDb.run(sqliteQuery, params, function(err) {
            if (err) reject(err);
            else resolve({ rows: [{ id: this.lastID }] });
          });
        }
      });
    }
  };
}

// Função para inicializar as tabelas (apenas para PostgreSQL)
async function initializeDatabase() {
  if (useSQLite) {
    console.log('✅ SQLite já inicializado');
    return;
  }

  try {
    // Criar tabela de listas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listas (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL UNIQUE,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de carros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS carros (
        id SERIAL PRIMARY KEY,
        lista_id INTEGER NOT NULL,
        marca TEXT,
        modelo TEXT,
        ano TEXT,
        valor REAL,
        classificacao TEXT,
        data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lista_id) REFERENCES listas (id)
      )
    `);

    // Inserir listas padrão se não existirem
    await pool.query(`
      INSERT INTO listas (id, nome) VALUES 
      (1, 'Carros que posco ter'),
      (2, 'Carros que já tive')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('✅ Banco de dados PostgreSQL inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
}

// Funções auxiliares para operações no banco
const db = {
  query: (text, params) => pool.query(text, params),
  initialize: initializeDatabase,
  pool: pool
};

module.exports = db; 