import { initDatabase } from './db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initDatabase();
    res.json({ message: 'Banco de dados inicializado com sucesso' });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    res.status(500).json({ error: 'Erro ao inicializar banco de dados' });
  }
} 