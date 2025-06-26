const db = require('./database');

async function createTables() {
    try {
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            await db.query(`
                CREATE TABLE IF NOT EXISTS listas (
                    id SERIAL PRIMARY KEY,
                    nome VARCHAR(255) NOT NULL UNIQUE,
                    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            await db.query(`
                CREATE TABLE IF NOT EXISTS carros (
                    id SERIAL PRIMARY KEY,
                    lista_id INTEGER NOT NULL,
                    marca VARCHAR(255),
                    modelo VARCHAR(255),
                    ano VARCHAR(50),
                    valor DECIMAL(10,2),
                    classificacao VARCHAR(10),
                    data_consulta TIMESTAMP,
                    FOREIGN KEY (lista_id) REFERENCES listas (id)
                )
            `);

            await db.query(`
                INSERT INTO listas (id, nome) VALUES 
                (1, 'Carros que posso ter'),
                (2, 'Carros que já tive')
                ON CONFLICT (id) DO NOTHING
            `);
        } else {
            // SQLite
            db.run(`
                CREATE TABLE IF NOT EXISTS listas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL UNIQUE,
                    data_criacao TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

            db.run(`
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

            db.run(`
                INSERT OR IGNORE INTO listas (id, nome) VALUES 
                (1, 'Carros que posso ter'),
                (2, 'Carros que já tive')
            `);
        }

        console.log('Tabelas criadas com sucesso!');
    } catch (error) {
        console.error('Erro ao criar tabelas:', error);
    }
}

module.exports = { createTables }; 