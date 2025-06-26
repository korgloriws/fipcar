import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Chip
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const SeletorListaSalvar = ({ open, onClose, onConfirm, carro }) => {
    const [listas, setListas] = useState([]);
    const [listaSelecionada, setListaSelecionada] = useState('');

    useEffect(() => {
        if (open) {
            carregarListas();
        }
    }, [open]);

    const carregarListas = async () => {
        try {
            const response = await axios.get(`${API_URL}/listas`);
            setListas(response.data);
            if (response.data.length > 0) {
                setListaSelecionada(response.data[0].id);
            }
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
        }
    };

    const handleConfirmar = () => {
        if (listaSelecionada) {
            const carroComLista = {
                ...carro,
                lista_id: parseInt(listaSelecionada)
            };
            onConfirm(carroComLista);
            onClose();
        }
    };

    const handleCancelar = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCancelar} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="div">
                    Salvar Carro
                </Typography>
            </DialogTitle>
            <DialogContent>
                {carro && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Carro encontrado:
                        </Typography>
                        <Box sx={{ 
                            p: 2, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300'
                        }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {carro.marca} {carro.modelo}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Ano: {carro.ano}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Valor: {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(carro.valor)}
                            </Typography>
                            <Chip 
                                label={`Classificação ${carro.classificacao}`}
                                size="small"
                                sx={{ mt: 1 }}
                                color="primary"
                            />
                        </Box>
                    </Box>
                )}
                
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Em qual lista você deseja salvar este carro?
                </Typography>
                
                <FormControl fullWidth>
                    <InputLabel>Selecione uma lista</InputLabel>
                    <Select
                        value={listaSelecionada}
                        onChange={(e) => setListaSelecionada(e.target.value)}
                        label="Selecione uma lista"
                    >
                        {listas.map((lista) => (
                            <MenuItem key={lista.id} value={lista.id}>
                                {lista.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelar}>Cancelar</Button>
                <Button 
                    onClick={handleConfirmar} 
                    variant="contained"
                    disabled={!listaSelecionada}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SeletorListaSalvar; 