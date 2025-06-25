import { neon } from '@neondatabase/serverless';

// Configuração do banco Neon
const sql = neon(process.env.DATABASE_URL);

// Função para inicializar as tabelas
export async function initDatabase() {
  try {
    // Criar tabela de listas
    await sql`
      CREATE TABLE IF NOT EXISTS listas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL UNIQUE,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Criar tabela de carros
    await sql`
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
    `;

    // Inserir listas padrão se não existirem
    await sql`
      INSERT INTO listas (id, nome) 
      VALUES (1, 'Carros que posso ter'), (2, 'Carros que já tive')
      ON CONFLICT (id) DO NOTHING
    `;

    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

// Função para classificar valor
export function classificarValor(valor) {
  if (valor <= 20000) return 'E';
  if (valor <= 35000) return 'D';
  if (valor <= 50000) return 'C';
  if (valor <= 75000) return 'B';
  if (valor <= 100000) return 'A';
  return 'S';
}

export { sql }; 