import { sql, classificarValor } from './db.js';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Buscar carros
        const { lista_id } = req.query;
        let carros;
        
        if (lista_id) {
          carros = await sql`
            SELECT c.*, l.nome as lista_nome 
            FROM carros c 
            JOIN listas l ON c.lista_id = l.id
            WHERE c.lista_id = ${lista_id}
            ORDER BY c.data_consulta DESC
          `;
        } else {
          carros = await sql`
            SELECT c.*, l.nome as lista_nome 
            FROM carros c 
            JOIN listas l ON c.lista_id = l.id
            ORDER BY c.data_consulta DESC
          `;
        }
        
        res.json(carros);
        break;

      case 'POST':
        // Criar novo carro
        const { marca, modelo, ano, valor, data_consulta, lista_id: listaId } = req.body;
        const classificacao = classificarValor(valor);
        
        const result = await sql`
          INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) 
          VALUES (${marca}, ${modelo}, ${ano}, ${valor}, ${classificacao}, ${data_consulta}, ${listaId || 1}) 
          RETURNING *
        `;
        
        res.json({ message: 'Carro salvo com sucesso', carro: result[0] });
        break;

      case 'PUT':
        // Atualizar carro
        const { id, marca: marcaUpdate, modelo: modeloUpdate, ano: anoUpdate, valor: valorUpdate, data_consulta: dataConsultaUpdate, lista_id: listaIdUpdate } = req.body;
        const classificacaoUpdate = classificarValor(valorUpdate);
        
        await sql`
          UPDATE carros 
          SET marca = ${marcaUpdate}, modelo = ${modeloUpdate}, ano = ${anoUpdate}, valor = ${valorUpdate}, classificacao = ${classificacaoUpdate}, data_consulta = ${dataConsultaUpdate}, lista_id = ${listaIdUpdate || 1} 
          WHERE id = ${id}
        `;
        
        res.json({ message: 'Carro atualizado com sucesso' });
        break;

      case 'DELETE':
        // Deletar carro
        const { id: deleteId } = req.query;
        
        await sql`DELETE FROM carros WHERE id = ${deleteId}`;
        
        res.json({ message: 'Carro deletado com sucesso' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro na API de carros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
} 