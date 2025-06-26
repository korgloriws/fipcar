import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Collapse,
    Fade,
    useTheme,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getClassificacaoColor = (classificacao) => {
    const cores = {
        'E': '#2E7D32',
        'D': '#43A047',
        'C': '#FBC02D',
        'B': '#FF8F00',
        'A': '#E64A19',
        'S': '#D32F2F'
    };
    return cores[classificacao] || '#757575';
};

const getClassificacaoDescricao = (classificacao) => {
    const descricoes = {
        'E': 'Até R$ 20.000',
        'D': 'R$ 20.001 - R$ 35.000',
        'C': 'R$ 35.001 - R$ 50.000',
        'B': 'R$ 50.001 - R$ 75.000',
        'A': 'R$ 75.001 - R$ 100.000',
        'S': 'Acima de R$ 100.000'
    };
    return descricoes[classificacao] || '';
};

const ListaCarros = ({ carros, onEditCarro, onDeleteCarro, listaAtiva, nomeListaAtiva }) => {
    const [filtroClassificacao, setFiltroClassificacao] = useState('');
    const [expandedGroups, setExpandedGroups] = useState({});
    const [marcas, setMarcas] = useState([]);
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

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este carro?')) {
            try {
                await axios.delete(`${API_URL}/carros/${id}`);
                onDeleteCarro();
            } catch (error) {
                console.error('Erro ao deletar carro:', error);
                alert('Erro ao deletar carro');
            }
        }
    };

    const formatarValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const toggleGroup = (classificacao) => {
        setExpandedGroups(prev => ({
            ...prev,
            [classificacao]: !prev[classificacao]
        }));
    };

    const carrosFiltrados = filtroClassificacao
        ? carros.filter(carro => carro.classificacao === filtroClassificacao)
        : carros;

    const carrosAgrupados = carrosFiltrados.reduce((acc, carro) => {
        if (!acc[carro.classificacao]) {
            acc[carro.classificacao] = [];
        }
        acc[carro.classificacao].push(carro);
        return acc;
    }, {});

    // Ordenar carros por valor dentro de cada grupo
    Object.keys(carrosAgrupados).forEach(classificacao => {
        carrosAgrupados[classificacao].sort((a, b) => b.valor - a.valor);
    });

    const classificacoes = ['E', 'D', 'C', 'B', 'A', 'S'];

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h2" sx={{ 
                            fontWeight: 'bold',
                            color: theme.palette.primary.main
                        }}>
                            {nomeListaAtiva || 'Carros Consultados'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Filtrar por Classificação</InputLabel>
                            <Select
                                value={filtroClassificacao}
                                onChange={(e) => setFiltroClassificacao(e.target.value)}
                                label="Filtrar por Classificação"
                            >
                                <MenuItem value="">Todas as Classificações</MenuItem>
                                {classificacoes.map((classificacao) => (
                                    <MenuItem key={classificacao} value={classificacao}>
                                        {classificacao} - {getClassificacaoDescricao(classificacao)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {classificacoes.map((classificacao) => {
                    const carrosGrupo = carrosAgrupados[classificacao] || [];
                    if (carrosGrupo.length === 0) return null;

                    return (
                        <Fade in={true} key={classificacao}>
                            <Box sx={{ mb: 4 }}>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 2,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.8
                                        }
                                    }}
                                    onClick={() => toggleGroup(classificacao)}
                                >
                                    <Chip
                                        label={`Classificação ${classificacao} - ${getClassificacaoDescricao(classificacao)}`}
                                        style={{
                                            backgroundColor: getClassificacaoColor(classificacao),
                                            color: 'white',
                                            marginRight: '10px',
                                            fontSize: '1rem',
                                            padding: '20px 10px'
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ flex: 1 }}>
                                        ({carrosGrupo.length} {carrosGrupo.length === 1 ? 'carro' : 'carros'})
                                    </Typography>
                                    <IconButton>
                                        {expandedGroups[classificacao] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </Box>

                                <Collapse in={expandedGroups[classificacao]}>
                                    <List sx={{ 
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        boxShadow: 1
                                    }}>
                                        {carrosGrupo.map((carro, index) => (
                                            <React.Fragment key={carro.id}>
                                                <ListItem
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        '&:hover': {
                                                            bgcolor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 2,
                                                        mr: 2
                                                    }}>
                                                        {marcas.find(m => m.Label === carro.marca)?.imageUrl && (
                                                            <Box 
                                                                component="img"
                                                                src={marcas.find(m => m.Label === carro.marca).imageUrl}
                                                                alt={carro.marca}
                                                                sx={{
                                                                    width: '100px',
                                                                    height: '100px',
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
                                                                {carro.marca} {carro.modelo}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Box>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Ano: {carro.ano}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Consulta: {formatarData(carro.data_consulta)}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                            {formatarValor(carro.valor)}
                                                        </Typography>
                                                        <Box>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => onEditCarro(carro)}
                                                                sx={{ mr: 1 }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDelete(carro.id)}
                                                                color="error"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </ListItem>
                                                {index < carrosGrupo.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        </Fade>
                    );
                })}
            </Box>
        </Container>
    );
};

export default ListaCarros; 