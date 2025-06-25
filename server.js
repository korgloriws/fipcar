// Carregar variáveis de ambiente
require('dotenv').config({ path: './config.env' });

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log das configurações de banco
console.log('=== CONFIGURAÇÃO DE BANCO ===');
console.log('DATABASE_URL configurada:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('============================');

// Configuração do banco - Neon para produção, SQLite para desenvolvimento
let sql;
let db;

if (process.env.DATABASE_URL) {
    // Produção - usar Neon
    try {
        const { neon } = require('@neondatabase/serverless');
        sql = neon(process.env.DATABASE_URL);
        console.log('✅ Conectado ao banco Neon (produção)');
    } catch (error) {
        console.error('❌ Erro ao conectar ao Neon:', error);
        console.log('🔄 Falling back para SQLite...');
        // Fallback para SQLite se Neon falhar
        const sqlite3 = require('sqlite3').verbose();
        db = new sqlite3.Database(path.join(__dirname, 'carros.db'), (err) => {
            if (err) {
                console.error('❌ Erro ao conectar ao banco de dados:', err);
            } else {
                console.log('✅ Conectado ao banco de dados SQLite (fallback)');
                createTables();
            }
        });
    }
} else {
    // Desenvolvimento - usar SQLite
    const sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database(path.join(__dirname, 'carros.db'), (err) => {
        if (err) {
            console.error('❌ Erro ao conectar ao banco de dados:', err);
        } else {
            console.log('✅ Conectado ao banco de dados SQLite (desenvolvimento)');
            createTables();
        }
    });
    console.log('🔄 Usando banco SQLite (desenvolvimento)');
}

// Função para inicializar as tabelas
async function createTables() {
    try {
        if (process.env.DATABASE_URL && sql) {
            // Neon - PostgreSQL
            await sql`
                CREATE TABLE IF NOT EXISTS listas (
                    id SERIAL PRIMARY KEY,
                    nome VARCHAR(255) NOT NULL UNIQUE,
                    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            await sql`
                CREATE TABLE IF NOT EXISTS carros (
                    id SERIAL PRIMARY KEY,
                    lista_id INTEGER NOT NULL,
                    marca VARCHAR(255),
                    modelo VARCHAR(255),
                    ano VARCHAR(50),
                    valor DECIMAL(10,2),
                    classificacao VARCHAR(10),
                    data_consulta TIMESTAMP,
                    FOREIGN KEY (lista_id) REFERENCES listas (id)
                )
            `;

            await sql`
                INSERT INTO listas (id, nome) 
                VALUES (1, 'Carros que posso ter'), (2, 'Carros que já tive')
                ON CONFLICT (id) DO NOTHING
            `;
        } else if (db) {
            // SQLite
            db.run(`
                CREATE TABLE IF NOT EXISTS listas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL UNIQUE,
                    data_criacao TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `);

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

            db.run(`
                INSERT OR IGNORE INTO listas (id, nome) VALUES 
                (1, 'Carros que posso ter'),
                (2, 'Carros que já tive')
            `);
        }

        console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
    }
}

// Inicializar tabelas se estiver usando Neon
if (process.env.DATABASE_URL && sql) {
    createTables();
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
        const { marca, modelo, ano, valor, data_consulta, lista_id } = req.body;
        const classificacao = classificarValor(valor);
        
        if (process.env.DATABASE_URL) {
            // Neon
            const result = await sql`
                INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) 
                VALUES (${marca}, ${modelo}, ${ano}, ${valor}, ${classificacao}, ${data_consulta}, ${lista_id || 1}) 
                RETURNING *
            `;
            res.json({ message: 'Carro salvo com sucesso', carro: result[0] });
        } else {
            // SQLite
            const stmt = db.prepare('INSERT INTO carros (marca, modelo, ano, valor, classificacao, data_consulta, lista_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
            stmt.run(marca, modelo, ano, valor, classificacao, data_consulta, lista_id || 1);
            stmt.finalize();
            res.json({ message: 'Carro salvo com sucesso' });
        }
    } catch (error) {
        console.error('Erro ao salvar carro:', error);
        res.status(500).json({ error: 'Erro ao salvar carro' });
    }
});

app.get('/api/carros', async (req, res) => {
    try {
        const { lista_id } = req.query;
        
        if (process.env.DATABASE_URL) {
            // Neon
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
        } else {
            // SQLite
            let sqlQuery = `SELECT c.*, l.nome as lista_nome FROM carros c 
                           JOIN listas l ON c.lista_id = l.id`;
            let params = [];
            
            if (lista_id) {
                sqlQuery += ` WHERE c.lista_id = ?`;
                params.push(lista_id);
            }
            
            sqlQuery += ` ORDER BY c.data_consulta DESC`;
            
            db.all(sqlQuery, params, (err, rows) => {
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
        const classificacao = classificarValor(valor);
        
        if (process.env.DATABASE_URL) {
            // Neon
            await sql`
                UPDATE carros 
                SET marca = ${marca}, modelo = ${modelo}, ano = ${ano}, valor = ${valor}, classificacao = ${classificacao}, data_consulta = ${data_consulta}, lista_id = ${lista_id || 1} 
                WHERE id = ${req.params.id}
            `;
        } else {
            // SQLite
            const sqlQuery = `UPDATE carros SET marca = ?, modelo = ?, ano = ?, valor = ?, data_consulta = ?, lista_id = ? WHERE id = ?`;
            db.run(sqlQuery, [marca, modelo, ano, valor, data_consulta, lista_id || 1, req.params.id], function(err) {
                if (err) {
                    console.error('Erro ao atualizar carro:', err);
                    res.status(500).json({ error: 'Erro ao atualizar carro' });
                    return;
                }
            });
        }
        
        res.json({ message: 'Carro atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).json({ error: 'Erro ao atualizar carro' });
    }
});

app.delete('/api/carros/:id', async (req, res) => {
    try {
        if (process.env.DATABASE_URL) {
            // Neon
            await sql`DELETE FROM carros WHERE id = ${req.params.id}`;
        } else {
            // SQLite
            const sqlQuery = `DELETE FROM carros WHERE id = ?`;
            db.run(sqlQuery, [req.params.id], function(err) {
                if (err) {
                    console.error('Erro ao deletar carro:', err);
                    res.status(500).json({ error: 'Erro ao deletar carro' });
                    return;
                }
            });
        }
        
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
        if (process.env.DATABASE_URL) {
            // Neon
            const listas = await sql`SELECT * FROM listas ORDER BY data_criacao ASC`;
            res.json(listas);
        } else {
            // SQLite
            const sqlQuery = `SELECT * FROM listas ORDER BY data_criacao ASC`;
            db.all(sqlQuery, [], (err, rows) => {
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
        
        if (process.env.DATABASE_URL) {
            // Neon
            const result = await sql`INSERT INTO listas (nome) VALUES (${nome.trim()}) RETURNING *`;
            res.json({ message: 'Lista criada com sucesso', lista: result[0] });
        } else {
            // SQLite
            const stmt = db.prepare('INSERT INTO listas (nome) VALUES (?)');
            stmt.run(nome.trim());
            stmt.finalize();
            res.json({ message: 'Lista criada com sucesso' });
        }
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
        
        if (process.env.DATABASE_URL) {
            // Neon
            await sql`UPDATE listas SET nome = ${nome.trim()} WHERE id = ${req.params.id}`;
        } else {
            // SQLite
            const sqlQuery = `UPDATE listas SET nome = ? WHERE id = ?`;
            db.run(sqlQuery, [nome.trim(), req.params.id], function(err) {
                if (err) {
                    console.error('Erro ao atualizar lista:', err);
                    res.status(500).json({ error: 'Erro ao atualizar lista' });
                    return;
                }
            });
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
        
        // Verificar se é uma das listas padrão (não pode ser excluída)
        if (listaId === '1' || listaId === '2') {
            return res.status(400).json({ error: 'Não é possível excluir as listas padrão' });
        }
        
        if (process.env.DATABASE_URL) {
            // Neon
            await sql`DELETE FROM carros WHERE lista_id = ${listaId}`;
            await sql`DELETE FROM listas WHERE id = ${listaId}`;
        } else {
            // SQLite
            const deleteCarrosSql = `DELETE FROM carros WHERE lista_id = ?`;
            db.run(deleteCarrosSql, [listaId], function(err) {
                if (err) {
                    console.error('Erro ao deletar carros da lista:', err);
                    res.status(500).json({ error: 'Erro ao deletar carros da lista' });
                    return;
                }
                
                const deleteListaSql = `DELETE FROM listas WHERE id = ?`;
                db.run(deleteListaSql, [listaId], function(err) {
                    if (err) {
                        console.error('Erro ao deletar lista:', err);
                        res.status(500).json({ error: 'Erro ao deletar lista' });
                        return;
                    }
                });
            });
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