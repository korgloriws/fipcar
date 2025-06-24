import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    useTheme
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const SeletorLista = ({ listaAtiva, onListaChange }) => {
    const [listas, setListas] = useState([]);
    const theme = useTheme();

    useEffect(() => {
        carregarListas();
    }, []);

    const carregarListas = async () => {
        try {
            const response = await axios.get(`${API_URL}/listas`);
            setListas(response.data);
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
        }
    };

    const handleListaChange = (event) => {
        const novaLista = event.target.value;
        onListaChange(novaLista);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    Lista Ativa:
                </Typography>
                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Selecione uma lista</InputLabel>
                    <Select
                        value={listaAtiva || ''}
                        onChange={handleListaChange}
                        label="Selecione uma lista"
                    >
                        {listas.map((lista) => (
                            <MenuItem key={lista.id} value={lista.id}>
                                {lista.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default SeletorLista; 