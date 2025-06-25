const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Configuração do banco SQLite (origem)
const sqliteDb = new sqlite3.Database(path.join(__dirname, 'carros.db'));

// Configuração do banco PostgreSQL (destino)
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrateData() {
  try {
    console.log('🚀 Iniciando migração de dados...');

    // Migrar listas
    console.log('📋 Migrando listas...');
    const listas = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM listas', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const lista of listas) {
      await pgPool.query(
        'INSERT INTO listas (id, nome, data_criacao) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
        [lista.id, lista.nome, lista.data_criacao]
      );
    }
    console.log(`✅ ${listas.length} listas migradas`);

    // Migrar carros
    console.log('🚗 Migrando carros...');
    const carros = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM carros', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    for (const carro of carros) {
      await pgPool.query(
        'INSERT INTO carros (id, lista_id, marca, modelo, ano, valor, classificacao, data_consulta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
        [carro.id, carro.lista_id, carro.marca, carro.modelo, carro.ano, carro.valor, carro.classificacao, carro.data_consulta]
      );
    }
    console.log(`✅ ${carros.length} carros migrados`);

    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    sqliteDb.close();
    await pgPool.end();
  }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  migrateData();
}

module.exports = migrateData; 