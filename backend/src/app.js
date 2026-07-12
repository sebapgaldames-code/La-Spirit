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

const app = express();

// Ojito con esto, tiene que ver con la conexión de la API con el front (preguntarle al profe)
app.use(cors());
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
