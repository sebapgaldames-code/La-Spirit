import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productoRoutes from './routes/productoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';

dotenv.config();
connectDB();

const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: 'https://la-spirit-backend-ds8g.onrender.com/', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/reportes', reporteRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Botillería "La Spirit" funcionando' });
});

export default app;
