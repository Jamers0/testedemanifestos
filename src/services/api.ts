import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

export const uploadFiles = async (orderFile: File, stockFile: File) => {
  console.log('Iniciando upload - Arquivo de pedidos:', orderFile.name);
  console.log('Iniciando upload - Arquivo de estoque:', stockFile.name);

  const formData = new FormData();
  formData.append('orders', orderFile);
  formData.append('stock', stockFile);

  try {
    const response = await api.post('/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Resposta do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw error;
  }
};

export const getProcessedOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};