import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Paper,
    CircularProgress,

    Divider,
    useTheme,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import SeletorListaSalvar from './SeletorListaSalvar';

const API_URL = 'http://localhost:3001/api';

const classificarValor = (valor) => {
    if (valor <= 20000) return 'E';
    if (valor <= 35000) return 'D';
    if (valor <= 50000) return 'C';
    if (valor <= 75000) return 'B';
    if (valor <= 100000) return 'A';
    return 'S';
};

const Busca = ({ onCarroEncontrado }) => {
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [anos, setAnos] = useState([]);
    const [selectedMarca, setSelectedMarca] = useState('');
    const [selectedModelo, setSelectedModelo] = useState('');
    const [selectedAno, setSelectedAno] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultadoBusca, setResultadoBusca] = useState(null);
    const [carImage, setCarImage] = useState(null);
    const [showSeletorLista, setShowSeletorLista] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        carregarMarcas();
    }, []);

    const carregarMarcas = async () => {
        try {
            const response = await axios.get(`${API_URL}/marcas`);
            if (Array.isArray(response.data)) {
                setMarcas(response.data);
            } else if (response.data && Array.isArray(response.data.Modelos)) {
                setMarcas(response.data.Modelos);
            } else {
                setMarcas([]);
            }
        } catch (error) {
            console.error('Erro ao carregar marcas:', error);
            setMarcas([]);
        }
    };

    const carregarModelos = async (marcaId) => {
        try {
            const response = await axios.post(`${API_URL}/modelos`, { marcaId });
            if (response.data && Array.isArray(response.data.Modelos)) {
                setModelos(response.data.Modelos);
            } else {
                setModelos([]);
            }
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
            setModelos([]);
        }
    };

    const carregarAnos = async (modeloId) => {
        try {
            const response = await axios.post(`${API_URL}/anos`, { 
                modeloId,
                marcaId: selectedMarca 
            });
            if (Array.isArray(response.data)) {
                setAnos(response.data);
            } else {
                setAnos([]);
            }
        } catch (error) {
            console.error('Erro ao carregar anos:', error);
            setAnos([]);
        }
    };

    const handleMarcaChange = (event) => {
        const marcaId = event.target.value;
        setSelectedMarca(marcaId);
        setSelectedModelo('');
        setSelectedAno('');
        setModelos([]);
        setAnos([]);
        setResultadoBusca(null);
        if (marcaId) {
            carregarModelos(marcaId);
        }
    };

    const handleModeloChange = (event) => {
        const modeloId = event.target.value;
        setSelectedModelo(modeloId);
        setSelectedAno('');
        setAnos([]);
        setResultadoBusca(null);
        if (modeloId) {
            carregarAnos(modeloId);
        }
    };

    const handleAnoChange = (event) => {
        setSelectedAno(event.target.value);
        setResultadoBusca(null);
    };

    const buscarImagemCarro = async (marca, ano) => {
        try {
            console.log('Buscando imagem para:', { marca, ano });
            const response = await axios.get(`${API_URL}/car-images`, {
                params: {
                    make: marca,
                    year: ano
                }
            });
            
            console.log('Resposta da API de imagens:', response.data);
            
            if (response.data.Models && response.data.Models.length > 0) {
                const model = response.data.Models[0];
                if (model.model_image) {
                    setCarImage(model.model_image);
                } else {
                    console.log('Nenhuma imagem encontrada para o modelo');
                }
            } else {
                console.log('Nenhum modelo encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar imagem do carro:', error);
        }
    };

    const handleBuscar = async () => {
        if (!selectedMarca || !selectedModelo || !selectedAno) {
            alert('Por favor, selecione marca, modelo e ano');
            return;
        }

        setLoading(true);
        setCarImage(null);
        try {
            const response = await axios.post(`${API_URL}/valor`, {
                marcaId: selectedMarca,
                modeloId: selectedModelo,
                anoId: selectedAno
            });

            if (response.data && response.data.Valor) {
                const valorNumerico = parseFloat(response.data.Valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
                const classificacao = classificarValor(valorNumerico);
                
                const resultado = {
                    marca: response.data.Marca,
                    modelo: response.data.Modelo,
                    ano: response.data.AnoModelo.toString(),
                    valor: valorNumerico,
                    classificacao,
                    data_consulta: new Date().toISOString()
                };
                
                setResultadoBusca(resultado);
                buscarImagemCarro(resultado.marca, resultado.ano);
            }
        } catch (error) {
            console.error('Erro ao buscar valor:', error);
            alert('Erro ao buscar valor do veículo');
        } finally {
            setLoading(false);
        }
    };

    const handleSalvar = () => {
        if (resultadoBusca) {
            setShowSeletorLista(true);
        }
    };

    const handleConfirmarSalvar = (carroComLista) => {
        onCarroEncontrado(carroComLista);
        setResultadoBusca(null);
        setSelectedMarca('');
        setSelectedModelo('');
        setSelectedAno('');
        setModelos([]);
        setAnos([]);
        setCarImage(null);
    };

    const handleCancelarSalvar = () => {
        setShowSeletorLista(false);
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    mb: 4
                }}>
                    FIPCAR
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Marca</InputLabel>
                            <Select
                                value={selectedMarca}
                                onChange={handleMarcaChange}
                                label="Marca"
                                sx={{ 
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.primary.main
                                    }
                                }}
                            >
                                {Array.isArray(marcas) && marcas.map((marca) => (
                                    <MenuItem 
                                        key={marca.Value} 
                                        value={marca.Value} 
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2,
                                            minHeight: '48px',
                                            padding: '8px 16px'
                                        }}
                                    >
                                        {marca.imageUrl && (
                                            <Box 
                                                component="img"
                                                src={marca.imageUrl}
                                                alt={marca.Label}
                                                sx={{
                                                    width: '40px',
                                                    height: '40px',
                                                    objectFit: 'contain',
                                                    backgroundColor: 'white',
                                                    borderRadius: '4px',
                                                    padding: '4px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <Typography variant="body1">{marca.Label}</Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Modelo</InputLabel>
                            <Select
                                value={selectedModelo}
                                onChange={handleModeloChange}
                                label="Modelo"
                                disabled={!selectedMarca}
                                sx={{ 
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.primary.main
                                    }
                                }}
                            >
                                {Array.isArray(modelos) && modelos.map((modelo) => (
                                    <MenuItem key={modelo.Value} value={modelo.Value}>
                                        {modelo.Label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Ano</InputLabel>
                            <Select
                                value={selectedAno}
                                onChange={handleAnoChange}
                                label="Ano"
                                disabled={!selectedModelo}
                                sx={{ 
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: theme.palette.primary.main
                                    }
                                }}
                            >
                                {Array.isArray(anos) && anos.map((ano) => (
                                    <MenuItem key={ano.Value} value={ano.Value}>
                                        {ano.Label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBuscar}
                            disabled={loading || !selectedMarca || !selectedModelo || !selectedAno}
                            fullWidth
                            size="large"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                            sx={{ 
                                py: 1.5,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4
                                }
                            }}
                        >
                            {loading ? 'Buscando...' : 'Buscar Valor'}
                        </Button>
                    </Grid>
                </Grid>

                {resultadoBusca && (
                    <Box sx={{ mt: 4 }}>
                        <Divider sx={{ my: 3 }} />
                        <Box sx={{ 
                            borderRadius: 2,
                            border: `2px solid ${theme.palette.primary.main}`,
                            p: 3
                        }}>
                            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
                                Resultado da Consulta
                            </Typography>
                            <List>
                                <ListItem>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        mr: 2
                                    }}>
                                        {marcas.find(m => m.Label === resultadoBusca.marca)?.imageUrl && (
                                            <Box 
                                                component="img"
                                                src={marcas.find(m => m.Label === resultadoBusca.marca).imageUrl}
                                                alt={resultadoBusca.marca}
                                                sx={{
                                                    width: '60px',
                                                    height: '60px',
                                                    objectFit: 'contain',
                                                    backgroundColor: 'white',
                                                    borderRadius: '4px',
                                                    padding: '4px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6">
                                                {resultadoBusca.marca} {resultadoBusca.modelo}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Ano: {resultadoBusca.ano}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Classificação: {resultadoBusca.classificacao}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {formatarValor(resultadoBusca.valor)}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            </List>
                            {carImage && (
                                <Box sx={{ 
                                    mt: 2,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 2
                                }}>
                                    <img 
                                        src={carImage} 
                                        alt={`${resultadoBusca.marca} ${resultadoBusca.modelo}`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            )}
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSalvar}
                                    sx={{ 
                                        textTransform: 'none',
                                        px: 4
                                    }}
                                >
                                    Salvar Consulta
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>
            
            <SeletorListaSalvar
                open={showSeletorLista}
                onClose={handleCancelarSalvar}
                onConfirm={handleConfirmarSalvar}
                carro={resultadoBusca}
            />
        </Container>
    );
};

export default Busca; 