import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Buscando marcas...');
    const response = await axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarMarcas', {
      codigoTabelaReferencia: 315,
      codigoTipoVeiculo: 1
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta da API FIPE:', response.data);

    // Mapeamento de nomes especiais
    const brandNameMap = {
      'VW - VolksWagen': 'volkswagen',
      'KIA MOTORS': 'kia',
      'GM - Chevrolet': 'chevrolet',
      'MERCEDES-BENZ': 'mercedes',
      'ASTON MARTIN': 'astonmartin',
      'LAND ROVER': 'landrover',
      'ROLLS-ROYCE': 'rollsroyce',
      'ALFA ROMEO': 'alfaromeo',
      'SSANGYONG': 'ssangyong',
      'CAOA CHERY': 'chery',
      'CAOA CHERY/CHERY': 'chery',
      'GREAT WALL': 'greatwall',
      'HITECH ELECTRIC': 'hitech',
      'CROSS LANDER': 'crosslander',
      'CBT JIPE': 'cbt',
      'D2D MOTORS': 'd2d',
      'CAB MOTORS': 'cab',
      'AM GEN': 'amgen',
      'ASIA MOTORS': 'asiamotors',
      'BRM': 'brm',
      'BYD': 'byd',
      'CHANA': 'chana',
      'CHANGAN': 'changan',
      'DFSK': 'dfsk',
      'EFFA': 'effa',
      'ENGESA': 'engesa',
      'ENVEMO': 'envemo',
      'FEVER': 'fever',
      'FIBRAVAN': 'fibravan',
      'FOTON': 'foton',
      'FYBER': 'fyber',
      'GEELY': 'geely',
      'GURGEL': 'gurgel',
      'GWM': 'gwm',
      'HAFEI': 'hafei',
      'ISUZU': 'isuzu',
      'IVECO': 'iveco',
      'JAC': 'jac',
      'JINBEI': 'jinbei',
      'JPX': 'jpx',
      'LADA': 'lada',
      'LIFAN': 'lifan',
      'LOBINI': 'lobini',
      'LOTUS': 'lotus',
      'MAHINDRA': 'mahindra',
      'MATRA': 'matra',
      'MCLAREN': 'mclaren',
      'MERCURY': 'mercury',
      'MG': 'mg',
      'MIURA': 'miura',
      'PLYMOUTH': 'plymouth',
      'PONTIAC': 'pontiac',
      'RAM': 'ram',
      'RELY': 'rely',
      'ROVER': 'rover',
      'SAAB': 'saab',
      'SATURN': 'saturn',
      'SERES': 'seres',
      'SHINERAY': 'shineray',
      'TAC': 'tac',
      'TROLLER': 'troller',
      'WAKE': 'wake',
      'WALK': 'walk',
      'CITROEN': 'stla',
    };

    // Mapeamento de URLs diretas para logos específicos
    const directLogoUrls = {
      'NISSAN': 'https://img.logo.dev/nissan.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'CITROËN': 'https://img.logo.dev/citroen.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'PEUGEOT': 'https://img.logo.dev/peugeot.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'RENAULT': 'https://img.logo.dev/renault.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'TOYOTA': 'https://img.logo.dev/toyota.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'HONDA': 'https://img.logo.dev/honda.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'HYUNDAI': 'https://img.logo.dev/hyundai.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'FIAT': 'https://img.logo.dev/fiat.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'VOLKSWAGEN': 'https://img.logo.dev/volkswagen.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'TROLLER': 'https://img.logo.dev/troller.com.br?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'AGRALE': 'https://img.logo.dev/agrale.com.br?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'KIA MOTORS': 'https://img.logo.dev/kia.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'BUGRE': 'https://img.logo.dev/bugre.ind.br?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'CAOA CHERY': 'https://img.logo.dev/caoachery.com.br?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
      'JAGUAR': 'https://img.logo.dev/jaguar.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
    };

    // Função para gerar URL do logo
    const getLogoUrl = (marca) => {
      const marcaKey = marca.toUpperCase();
      console.log(`Verificando marca: "${marcaKey}"`);
      console.log(`Marca existe em directLogoUrls? ${directLogoUrls[marcaKey] ? 'SIM' : 'NÃO'}`);
      
      if (directLogoUrls[marcaKey]) {
        console.log(`Usando URL direta para ${marcaKey}: ${directLogoUrls[marcaKey]}`);
        return directLogoUrls[marcaKey];
      }

      const mappedName = brandNameMap[marca] || marca;
      const cleanMarca = mappedName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const defaultUrl = `https://img.logo.dev/${cleanMarca}.com?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true`;
      console.log(`Usando URL padrão para ${marca}: ${defaultUrl}`);
      return defaultUrl;
    };

    // Processar as marcas e adicionar URLs de logo
    const marcasProcessadas = response.data.map(marca => ({
      ...marca,
      logo_url: getLogoUrl(marca.Nome)
    }));

    res.json(marcasProcessadas);
  } catch (error) {
    console.error('Erro ao buscar marcas:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar marcas' });
  }
} 