const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const db = require('./database');
const { createTables } = require('./migrations');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar tabelas
createTables();

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

        const directLogoUrls = {
            'NISSAN': 'https://img.logo.dev/nissan.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'CITROEN': 'https://img.logo.dev/citroen.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'PEUGEOT': 'https://img.logo.dev/peugeot.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'RENAULT': 'https://img.logo.dev/renault.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'TOYOTA': 'https://img.logo.dev/toyota.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'HONDA': 'https://img.logo.dev/honda.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'HYUNDAI': 'https://img.logo.dev/hyundai.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'FIAT': 'https://img.logo.dev/fiat.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            
            'VOLKSWAGEN': 'https://img.logo.dev/volkswagen.com.co?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'TROLLER': 'https://img.logo.dev/troller.com.br?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true',
            'AGRALE': 'https://img.logo.dev/agrale.com.br?token=pk_Dhx4NNGHRFe5mo7gEtJaWA&retina=true'
        };

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

        const marcasComImagens = response.data.map(marca => {
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
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            const result = await db.query(
                'INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [marca, modelo, ano, valor, classificacao, data_consulta, lista_id || 1]
            );
        } else {
            // SQLite
            db.run(
                'INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [marca, modelo, ano, valor, classificacao, data_consulta, lista_id || 1]
            );
        }
        
        res.json({ message: 'Carro salvo com sucesso' });
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
            if (process.env.NODE_ENV === 'production') {
                sql += ` WHERE c.lista_id = $1`;
            } else {
                sql += ` WHERE c.lista_id = ?`;
            }
            params.push(lista_id);
        }
        
        sql += ` ORDER BY c.data_consulta DESC`;
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            const result = await db.query(sql, params);
            res.json(result.rows);
        } else {
            // SQLite
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('Erro ao listar carros:', err);
                    res.status(500).json({ error: 'Erro ao listar carros' });
                    return;
                }
                res.json(rows);
            });
        }
    } catch (error) {
        console.error('Erro ao listar carros:', error);
        res.status(500).json({ error: 'Erro ao listar carros' });
    }
});

app.put('/api/carros/:id', async (req, res) => {
    try {
        const { marca, modelo, ano, valor, data_consulta, lista_id } = req.body;
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            await db.query(
                `UPDATE carros SET marca = $1, modelo = $2, ano = $3, valor = $4, data_consulta = $5, lista_id = $6 WHERE id = $7`,
                [marca, modelo, ano, valor, data_consulta, lista_id || 1, req.params.id]
            );
        } else {
            // SQLite
            db.run(
                `UPDATE carros SET marca = ?, modelo = ?, ano = ?, valor = ?, data_consulta = ?, lista_id = ? WHERE id = ?`,
                [marca, modelo, ano, valor, data_consulta, lista_id || 1, req.params.id]
            );
        }
        
        res.json({ message: 'Carro atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).json({ error: 'Erro ao atualizar carro' });
    }
});

app.delete('/api/carros/:id', async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            await db.query('DELETE FROM carros WHERE id = $1', [req.params.id]);
        } else {
            // SQLite
            db.run('DELETE FROM carros WHERE id = ?', [req.params.id]);
        }
        
        res.json({ message: 'Carro deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar carro:', error);
        res.status(500).json({ error: 'Erro ao deletar carro' });
    }
});

app.get('/api/car-images', async (req, res) => {
    try {
        const { make, year } = req.query;
        console.log('Buscando imagem para:', { make, year });
        
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

app.get('/api/listas', async (req, res) => {
    try {
        const sql = `SELECT * FROM listas ORDER BY data_criacao ASC`;
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            const result = await db.query(sql);
            res.json(result.rows);
        } else {
            // SQLite
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error('Erro ao listar listas:', err);
                    res.status(500).json({ error: 'Erro ao listar listas' });
                    return;
                }
                res.json(rows);
            });
        }
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
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            await db.query('INSERT INTO listas (nome) VALUES ($1)', [nome.trim()]);
        } else {
            // SQLite
            db.run('INSERT INTO listas (nome) VALUES (?)', [nome.trim()]);
        }
        
        res.json({ message: 'Lista criada com sucesso' });
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
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            await db.query('UPDATE listas SET nome = $1 WHERE id = $2', [nome.trim(), req.params.id]);
        } else {
            // SQLite
            db.run('UPDATE listas SET nome = ? WHERE id = ?', [nome.trim(), req.params.id]);
        }
        
        res.json({ message: 'Lista atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
        res.status(500).json({ error: 'Erro ao atualizar lista' });
    }
});

app.delete('/api/listas/:id', async (req, res) => {
    try {
        const listaId = req.params.id;
        
        if (listaId === '1' || listaId === '2') {
            return res.status(400).json({ error: 'Não é possível excluir as listas padrão' });
        }
        
        if (process.env.NODE_ENV === 'production') {
            // PostgreSQL
            await db.query('DELETE FROM carros WHERE lista_id = $1', [listaId]);
            await db.query('DELETE FROM listas WHERE id = $1', [listaId]);
        } else {
            // SQLite
            db.run('DELETE FROM carros WHERE lista_id = ?', [listaId]);
            db.run('DELETE FROM listas WHERE id = ?', [listaId]);
        }
        
        res.json({ message: 'Lista deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        res.status(500).json({ error: 'Erro ao deletar lista' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
}); 