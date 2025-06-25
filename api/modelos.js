import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { marcaId } = req.body;
    console.log('Buscando modelos para marca:', marcaId);
    
    const response = await axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos', {
      codigoTabelaReferencia: 315,
      codigoTipoVeiculo: 1,
      codigoMarca: marcaId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Resposta da API FIPE:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar modelos:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar modelos' });
  }
} 