const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const db = new sqlite3.Database(path.join(__dirname, 'carros.db'), (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        createTables();
    }
});


function createTables() {
    // Tabela para as listas
    db.run(`
        CREATE TABLE IF NOT EXISTS listas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            data_criacao TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela para os carros com referência à lista
    db.run(`
        CREATE TABLE IF NOT EXISTS carros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lista_id INTEGER NOT NULL,
            marca TEXT,
            modelo TEXT,
            ano TEXT,
            valor REAL,
            classificacao TEXT,
            data_consulta TEXT,
            FOREIGN KEY (lista_id) REFERENCES listas (id)
        )
    `);

    // Inserir listas padrão se não existirem
    db.run(`
        INSERT OR IGNORE INTO listas (id, nome) VALUES 
        (1, 'Carros que posso ter'),
        (2, 'Carros que já tive')
    `);
}


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
        const stmt = db.prepare('INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
        stmt.run(marca, modelo, ano, valor, classificacao, data_consulta, lista_id || 1);
        stmt.finalize();
        res.json({ message: 'Carro salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar carro:', error);
        res.status(500).json({ error: 'Erro ao salvar carro' });
    }
});

app.get('/api/carros', (req, res) => {
    const { lista_id } = req.query;
    let sql = `SELECT c.*, l.nome as lista_nome FROM carros c 
               JOIN listas l ON c.lista_id = l.id`;
    let params = [];
    
    if (lista_id) {
        sql += ` WHERE c.lista_id = ?`;
        params.push(lista_id);
    }
    
    sql += ` ORDER BY c.data_consulta DESC`;
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao listar carros:', err);
            res.status(500).json({ error: 'Erro ao listar carros' });
            return;
        }
        res.json(rows);
    });
});

app.put('/api/carros/:id', (req, res) => {
    const { marca, modelo, ano, valor, data_consulta, lista_id } = req.body;
    const sql = `UPDATE carros SET marca = ?, modelo = ?, ano = ?, valor = ?, data_consulta = ?, lista_id = ? WHERE id = ?`;
    
    db.run(sql, [marca, modelo, ano, valor, data_consulta, lista_id || 1, req.params.id], function(err) {
        if (err) {
            console.error('Erro ao atualizar carro:', err);
            res.status(500).json({ error: 'Erro ao atualizar carro' });
            return;
        }
        res.json({ message: 'Carro atualizado com sucesso' });
    });
});

app.delete('/api/carros/:id', (req, res) => {
    const sql = `DELETE FROM carros WHERE id = ?`;
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            console.error('Erro ao deletar carro:', err);
            res.status(500).json({ error: 'Erro ao deletar carro' });
            return;
        }
        res.json({ message: 'Carro deletado com sucesso' });
    });
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
app.get('/api/listas', (req, res) => {
    const sql = `SELECT * FROM listas ORDER BY data_criacao ASC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Erro ao listar listas:', err);
            res.status(500).json({ error: 'Erro ao listar listas' });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/listas', (req, res) => {
    try {
        const { nome } = req.body;
        if (!nome || nome.trim() === '') {
            return res.status(400).json({ error: 'Nome da lista é obrigatório' });
        }
        
        const stmt = db.prepare('INSERT INTO listas (nome) VALUES (?)');
        stmt.run(nome.trim());
        stmt.finalize();
        res.json({ message: 'Lista criada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(500).json({ error: 'Erro ao criar lista' });
    }
});

app.put('/api/listas/:id', (req, res) => {
    const { nome } = req.body;
    if (!nome || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome da lista é obrigatório' });
    }
    
    const sql = `UPDATE listas SET nome = ? WHERE id = ?`;
    
    db.run(sql, [nome.trim(), req.params.id], function(err) {
        if (err) {
            console.error('Erro ao atualizar lista:', err);
            res.status(500).json({ error: 'Erro ao atualizar lista' });
            return;
        }
        res.json({ message: 'Lista atualizada com sucesso' });
    });
});

app.delete('/api/listas/:id', (req, res) => {
    const listaId = req.params.id;
    
    // Verificar se é uma das listas padrão (não pode ser excluída)
    if (listaId === '1' || listaId === '2') {
        return res.status(400).json({ error: 'Não é possível excluir as listas padrão' });
    }
    
    // Primeiro deletar todos os carros da lista
    const deleteCarrosSql = `DELETE FROM carros WHERE lista_id = ?`;
    
    db.run(deleteCarrosSql, [listaId], function(err) {
        if (err) {
            console.error('Erro ao deletar carros da lista:', err);
            res.status(500).json({ error: 'Erro ao deletar carros da lista' });
            return;
        }
        
        // Depois deletar a lista
        const deleteListaSql = `DELETE FROM listas WHERE id = ?`;
        
        db.run(deleteListaSql, [listaId], function(err) {
            if (err) {
                console.error('Erro ao deletar lista:', err);
                res.status(500).json({ error: 'Erro ao deletar lista' });
                return;
            }
            res.json({ message: 'Lista deletada com sucesso' });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 