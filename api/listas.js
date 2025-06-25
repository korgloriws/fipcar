import { sql } from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Buscar listas
        const listas = await sql`SELECT * FROM listas ORDER BY data_criacao ASC`;
        res.json(listas);
        break;

      case 'POST':
        // Criar nova lista
        const { nome } = req.body;
        if (!nome || nome.trim() === '') {
          return res.status(400).json({ error: 'Nome da lista é obrigatório' });
        }
        
        const result = await sql`INSERT INTO listas (nome) VALUES (${nome.trim()}) RETURNING *`;
        res.json({ message: 'Lista criada com sucesso', lista: result[0] });
        break;

      case 'PUT':
        // Atualizar lista
        const { id, nome: nomeUpdate } = req.body;
        
        if (!nomeUpdate || nomeUpdate.trim() === '') {
          return res.status(400).json({ error: 'Nome da lista é obrigatório' });
        }
        
        await sql`UPDATE listas SET nome = ${nomeUpdate.trim()} WHERE id = ${id}`;
        res.json({ message: 'Lista atualizada com sucesso' });
        break;

      case 'DELETE':
        // Deletar lista
        const { id: deleteId } = req.query;
        
        // Verificar se é uma das listas padrão (não pode ser excluída)
        if (deleteId === '1' || deleteId === '2') {
          return res.status(400).json({ error: 'Não é possível excluir as listas padrão' });
        }
        
        // Primeiro deletar todos os carros da lista
        await sql`DELETE FROM carros WHERE lista_id = ${deleteId}`;
        
        // Depois deletar a lista
        await sql`DELETE FROM listas WHERE id = ${deleteId}`;
        
        res.json({ message: 'Lista deletada com sucesso' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro na API de listas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 