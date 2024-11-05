import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBuckets = async () => {
  const response = await api.get('/buckets');
  return response.data;
};

export const createBucket = async (name: string) => {
  const response = await api.post('/buckets', { name });
  return response.data;
};

export const getFiles = async (bucketName: string) => {
  const response = await api.get(`/files/${bucketName}`);
  return response.data;
};

export const uploadFile = async (bucketName: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/files/${bucketName}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (bucketName: string, fileName: string) => {
  const response = await api.delete(`/files/${bucketName}/${fileName}`);
  return response.data;
};

export const downloadFile = async (bucketName: string, fileName: string) => {
  const response = await api.get(`/files/${bucketName}/${fileName}`, {
    responseType: 'blob',
  });
  return response.data;
};