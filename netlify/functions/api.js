const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de teste
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API funcionando no Netlify!', 
        timestamp: new Date().toISOString()
    });
});

// Sua API de marcas original
app.get('/api/marcas', async (req, res) => {
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

        // Mapeamento de nomes especiais (seu código original)
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
            
            if (directLogoUrls[marcaKey]) {
                return directLogoUrls[marcaKey];
            }

            const mappedName = brandNameMap[marca] || marca;
            const cleanMarca = mappedName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            return `https://img.logo.dev/${cleanMarca}.com?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true`;
        };

        // Adiciona URLs de imagens para cada marca
        const marcasComImagens = response.data.map(marca => ({
            ...marca,
            imageUrl: getLogoUrl(marca.Label)
        }));

        res.json(marcasComImagens);
    } catch (error) {
        console.error('Erro ao buscar marcas:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar marcas' });
    }
});

// Suas outras APIs aqui...
app.post('/api/modelos', async (req, res) => {
    try {
        const { marcaId } = req.body;
        const response = await axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarModelos', {
            codigoTabelaReferencia: 315,
            codigoTipoVeiculo: 1,
            codigoMarca: marcaId
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar modelos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar modelos' });
    }
});

app.post('/api/anos', async (req, res) => {
    try {
        const { modeloId, marcaId } = req.body;
        const response = await axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarAnoModelo', {
            codigoTabelaReferencia: 315,
            codigoTipoVeiculo: 1,
            codigoMarca: marcaId,
            codigoModelo: modeloId
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar anos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar anos' });
    }
});

app.post('/api/valor', async (req, res) => {
    try {
        const { marcaId, modeloId, anoId } = req.body;
        const [ano, tipoCombustivel] = anoId.split('-');
        
        const response = await axios.post('https://veiculos.fipe.org.br/api/veiculos/ConsultarValorComTodosParametros', {
            codigoTabelaReferencia: 315,
            codigoTipoVeiculo: 1,
            codigoMarca: parseInt(marcaId),
            codigoModelo: parseInt(modeloId),
            anoModelo: parseInt(ano),
            codigoTipoCombustivel: parseInt(tipoCombustivel),
            tipoConsulta: 'tradicional'
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar valor:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar valor' });
    }
});

// Para Netlify Functions
const handler = app;

module.exports = { handler }; 