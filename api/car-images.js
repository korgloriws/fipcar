export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { make, year } = req.query;
    console.log('Buscando imagem para:', { make, year });
    
    // Usando uma imagem local baseada na marca
    const imageUrl = `/images/${make.toLowerCase()}.jpg`;
    
    res.json({
      Models: [{
        model_image: imageUrl
      }]
    });
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
} 