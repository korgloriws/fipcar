import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Paper,
    Alert,
    Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const GerenciadorListas = ({ onListaChange }) => {
    const [listas, setListas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editando, setEditando] = useState(null);
    const [nomeLista, setNomeLista] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const carregarListas = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/listas`);
            setListas(response.data);
        } catch (error) {
            console.error('Erro ao carregar listas:', error);
            mostrarSnackbar('Erro ao carregar listas', 'error');
        }
    }, []);

    useEffect(() => {
        carregarListas();
    }, [carregarListas]);

    const mostrarSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleOpenDialog = (lista = null) => {
        if (lista) {
            setEditando(lista);
            setNomeLista(lista.nome);
        } else {
            setEditando(null);
            setNomeLista('');
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditando(null);
        setNomeLista('');
    };

    const handleSalvar = async () => {
        if (!nomeLista.trim()) {
            mostrarSnackbar('Nome da lista é obrigatório', 'error');
            return;
        }

        try {
            if (editando) {
                await axios.put(`${API_URL}/listas/${editando.id}`, { nome: nomeLista });
                mostrarSnackbar('Lista atualizada com sucesso');
            } else {
                await axios.post(`${API_URL}/listas`, { nome: nomeLista });
                mostrarSnackbar('Lista criada com sucesso');
            }
            
            handleCloseDialog();
            carregarListas();
            if (onListaChange) onListaChange();
        } catch (error) {
            console.error('Erro ao salvar lista:', error);
            const message = error.response?.data?.error || 'Erro ao salvar lista';
            mostrarSnackbar(message, 'error');
        }
    };

    const handleExcluir = async (lista) => {
        if (!window.confirm(`Tem certeza que deseja excluir a lista "${lista.nome}"?`)) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/listas/${lista.id}`);
            mostrarSnackbar('Lista excluída com sucesso');
            carregarListas();
            if (onListaChange) onListaChange();
        } catch (error) {
            console.error('Erro ao excluir lista:', error);
            const message = error.response?.data?.error || 'Erro ao excluir lista';
            mostrarSnackbar(message, 'error');
        }
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        Gerenciar Listas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ borderRadius: 2 }}
                    >
                        Nova Lista
                    </Button>
                </Box>

                <List>
                    {listas.map((lista) => (
                        <ListItem
                            key={lista.id}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                mb: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                            {lista.nome}
                                        </Typography>
                                        {(lista.id === 1 || lista.id === 2) && (
                                            <Chip 
                                                label="Padrão" 
                                                size="small" 
                                                color="primary" 
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={`Criada em: ${formatarData(lista.data_criacao)}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleOpenDialog(lista)}
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                                {(lista.id !== 1 && lista.id !== 2) && (
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleExcluir(lista)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editando ? 'Editar Lista' : 'Nova Lista'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nome da Lista"
                        fullWidth
                        variant="outlined"
                        value={nomeLista}
                        onChange={(e) => setNomeLista(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSalvar} variant="contained">
                        {editando ? 'Atualizar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GerenciadorListas; 