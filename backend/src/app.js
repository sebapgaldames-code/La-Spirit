import express from 'express';
import productoRoutes from './routes/productoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';

const app = express();

app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/ventas', ventaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Botillería "La Spirit" funcionando' });
});

export default app;

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

// Conectar a la base de datos
connectDB();

// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a La Spirit API' });
});

module.exports = app;
