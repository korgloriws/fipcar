const express = require('express');
const cors = require('cors');
const axios = require('axios');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// Inicializar banco de dados
db.initialize();


function classificarValor(valor) {
    if (valor <= 20000) return 'E';
    if (valor <= 35000) return 'D';
    if (valor <= 50000) return 'C';
    if (valor <= 75000) return 'B';
    if (valor <= 100000) return 'A';
    return 'S';
}


const fipeApi = axios.create({
    baseURL: 'https://veiculos.fipe.org.br/api/veiculos',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': 'veiculos.fipe.org.br',
        'Referer': 'https://veiculos.fipe.org.br/'
    }
});


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

        // Adiciona URLs de imagens para cada marca
        const marcasComImagens = response.data.map(marca => {
            // Gera a URL do logo
            const imageUrl = getLogoUrl(marca.Label);

            console.log(`Processando marca: ${marca.Label}`);
            console.log(`URL da imagem: ${imageUrl}`);
            console.log('-----------------------------------');

            return {
                ...marca,
                imageUrl
            };
        });

        console.log('Total de marcas processadas:', marcasComImagens.length);
        console.log('Primeira marca com imagem:', marcasComImagens[0]);

        res.json(marcasComImagens);
    } catch (error) {
        console.error('Erro ao buscar marcas:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar marcas' });
    }
});

app.post('/api/modelos', async (req, res) => {
    try {
        const { marcaId } = req.body;
        console.log('Buscando modelos para marca:', marcaId);
        const response = await fipeApi.post('/ConsultarModelos', {
            codigoTabelaReferencia: 315,
            codigoTipoVeiculo: 1,
            codigoMarca: marcaId
        });
        console.log('Resposta da API FIPE:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar modelos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar modelos' });
    }
});

app.post('/api/anos', async (req, res) => {
    try {
        const { modeloId, marcaId } = req.body;
        console.log('Buscando anos para modelo:', modeloId, 'marca:', marcaId);
        const response = await fipeApi.post('/ConsultarAnoModelo', {
            codigoTabelaReferencia: 315,
            codigoTipoVeiculo: 1,
            codigoMarca: marcaId,
            codigoModelo: modeloId
        });
        console.log('Resposta da API FIPE:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar anos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar anos' });
    }
});

app.post('/api/valor', async (req, res) => {
    try {
        const { marcaId, modeloId, anoId } = req.body;
        console.log('Buscando valor para:', { marcaId, modeloId, anoId });
        
        // Separar o ano e o tipo de combustível do anoId
        const [ano, tipoCombustivel] = anoId.split('-');
        
        const response = await fipeApi.post('/ConsultarValorComTodosParametros', {
            codigoTabelaReferencia: 315,
            codigoTipoVeiculo: 1,
            codigoMarca: parseInt(marcaId),
            codigoModelo: parseInt(modeloId),
            anoModelo: parseInt(ano),
            codigoTipoCombustivel: parseInt(tipoCombustivel),
            tipoConsulta: 'tradicional'
        });
        console.log('Resposta da API FIPE:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar valor:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar valor' });
    }
});


app.post('/api/carros', async (req, res) => {
    try {
        const { marca, modelo, ano, valor, classificacao, data_consulta, lista_id } = req.body;
        const result = await db.query(
            'INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [marca, modelo, ano, valor, classificacao, data_consulta, lista_id || 1]
        );
        res.json({ message: 'Carro salvo com sucesso', carro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao salvar carro:', error);
        res.status(500).json({ error: 'Erro ao salvar carro' });
    }
});

app.get('/api/carros', async (req, res) => {
    try {
        const { lista_id } = req.query;
        let sql = `SELECT c.*, l.nome as lista_nome FROM carros c 
                   JOIN listas l ON c.lista_id = l.id`;
        let params = [];
        
        if (lista_id) {
            sql += ` WHERE c.lista_id = $1`;
            params.push(lista_id);
        }
        
        sql += ` ORDER BY c.data_consulta DESC`;
        
        const result = await db.query(sql, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar carros:', error);
        res.status(500).json({ error: 'Erro ao listar carros' });
    }
});

app.put('/api/carros/:id', async (req, res) => {
    try {
        const { marca, modelo, ano, valor, data_consulta, lista_id } = req.body;
        const result = await db.query(
            'UPDATE carros SET marca = $1, modelo = $2, ano = $3, valor = $4, data_consulta = $5, lista_id = $6 WHERE id = $7 RETURNING *',
            [marca, modelo, ano, valor, data_consulta, lista_id || 1, req.params.id]
        );
        res.json({ message: 'Carro atualizado com sucesso', carro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).json({ error: 'Erro ao atualizar carro' });
    }
});

app.delete('/api/carros/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM carros WHERE id = $1 RETURNING *', [req.params.id]);
        res.json({ message: 'Carro deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar carro:', error);
        res.status(500).json({ error: 'Erro ao deletar carro' });
    }
});

// Add new endpoint for car images using local images
app.get('/api/car-images', async (req, res) => {
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
});

// Rotas para gerenciar listas
app.get('/api/listas', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM listas ORDER BY data_criacao ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao listar listas:', error);
        res.status(500).json({ error: 'Erro ao listar listas' });
    }
});

app.post('/api/listas', async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome || nome.trim() === '') {
            return res.status(400).json({ error: 'Nome da lista é obrigatório' });
        }
        
        const result = await db.query('INSERT INTO listas (nome) VALUES ($1) RETURNING *', [nome.trim()]);
        res.json({ message: 'Lista criada com sucesso', lista: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(500).json({ error: 'Erro ao criar lista' });
    }
});

app.put('/api/listas/:id', async (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome || nome.trim() === '') {
            return res.status(400).json({ error: 'Nome da lista é obrigatório' });
        }
        
        const result = await db.query('UPDATE listas SET nome = $1 WHERE id = $2 RETURNING *', [nome.trim(), req.params.id]);
        res.json({ message: 'Lista atualizada com sucesso', lista: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
        res.status(500).json({ error: 'Erro ao atualizar lista' });
    }
});

app.delete('/api/listas/:id', async (req, res) => {
    try {
        const listaId = req.params.id;
        
        // Não permitir excluir as listas padrão
        if (listaId === '1' || listaId === '2') {
            return res.status(400).json({ error: 'Não é possível excluir as listas padrão' });
        }
        
        // Deletar carros da lista primeiro
        await db.query('DELETE FROM carros WHERE lista_id = $1', [listaId]);
        
        // Deletar a lista
        const result = await db.query('DELETE FROM listas WHERE id = $1 RETURNING *', [listaId]);
        res.json({ message: 'Lista deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        res.status(500).json({ error: 'Erro ao deletar lista' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 