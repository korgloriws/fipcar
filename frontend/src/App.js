import React, { useState, useEffect, useCallback } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Tabs, Tab, Typography } from '@mui/material';
import Busca from './components/Busca';
import ListaCarros from './components/ListaCarros';
import GerenciadorListas from './components/GerenciadorListas';
import SeletorLista from './components/SeletorLista';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const classificarValor = (valor) => {
  if (valor <= 20000) return 'E';
  if (valor <= 35000) return 'D';
  if (valor <= 50000) return 'C';
  if (valor <= 75000) return 'B';
  if (valor <= 100000) return 'A';
  return 'S';
};

function App() {
  const [carros, setCarros] = useState([]);
  const [carroEditando, setCarroEditando] = useState(null);
  const [listaAtiva, setListaAtiva] = useState(1);
  const [nomeListaAtiva, setNomeListaAtiva] = useState('Carros que posso ter');
  const [tabAtiva, setTabAtiva] = useState(0);

  const carregarListas = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/listas`);
      
      // Atualizar nome da lista ativa
      const listaAtual = response.data.find(l => l.id === listaAtiva);
      if (listaAtual) {
        setNomeListaAtiva(listaAtual.nome);
      }
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
    }
  }, [listaAtiva]);

  const carregarCarros = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/carros?lista_id=${listaAtiva}`);
      setCarros(response.data);
    } catch (error) {
      console.error('Erro ao carregar carros:', error);
    }
  }, [listaAtiva]);

  useEffect(() => {
    carregarListas();
  }, [carregarListas]);

  useEffect(() => {
    carregarCarros();
  }, [carregarCarros]);

  const handleCarroEncontrado = async (carro) => {
    try {
      const carroComClassificacao = {
        ...carro,
        classificacao: carro.classificacao || classificarValor(carro.valor)
      };
      
      const response = await axios.post(`${API_URL}/carros`, carroComClassificacao);
      console.log('Carro salvo:', response.data);
      
      carregarCarros();
    } catch (error) {
      console.error('Erro ao salvar carro:', error);
      alert('Erro ao salvar carro');
    }
  };

  const handleEditCarro = (carro) => {
    setCarroEditando(carro);
  };

  const handleListaChange = (novaLista) => {
    setListaAtiva(novaLista);
  };

  const handleListaChangeFromManager = () => {
    carregarListas();
    carregarCarros();
  };

  const handleTabChange = (event, newValue) => {
    setTabAtiva(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 3 }}>
          <Tabs value={tabAtiva} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Consultar Carros" />
            <Tab label="Minhas Listas" />
            <Tab label="Gerenciar Listas" />
          </Tabs>

          {tabAtiva === 0 && (
            <Box>
              <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                FIPCAR - Consultar Preços de Carros
              </Typography>
              <Busca onCarroEncontrado={handleCarroEncontrado} />
            </Box>
          )}

          {tabAtiva === 1 && (
            <Box>
              <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
                Minhas Listas de Carros
              </Typography>
              <SeletorLista 
                listaAtiva={listaAtiva} 
                onListaChange={handleListaChange} 
              />
              <ListaCarros 
                carros={carros} 
                onEditCarro={handleEditCarro}
                onDeleteCarro={carregarCarros}
                carroEditando={carroEditando}
                listaAtiva={listaAtiva}
                nomeListaAtiva={nomeListaAtiva}
              />
            </Box>
          )}

          {tabAtiva === 2 && (
            <GerenciadorListas onListaChange={handleListaChangeFromManager} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 