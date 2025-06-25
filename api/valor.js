import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { marcaId, modeloId, anoId } = req.body;
    console.log('Buscando valor para:', { marcaId, modeloId, anoId });
    
    // Separar o ano e o tipo de combustível do anoId
    const [ano, tipoCombustivel] = anoId.split('-');
    
    const response = await axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros', {
      codigoTabelaReferencia: 315,
      codigoTipoVeiculo: 1,
      codigoMarca: parseInt(marcaId),
      codigoModelo: parseInt(modeloId),
      anoModelo: parseInt(ano),
      codigoTipoCombustivel: parseInt(tipoCombustivel),
      tipoConsulta: 'tradicional'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Resposta da API FIPE:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar valor:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar valor' });
  }
} 