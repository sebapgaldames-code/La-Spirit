import { Router } from 'express';
import {
  ventasPorPeriodo,
  productosMasVendidos,
  stockCritico,
  ventasPorCategoria,
  clientesFrecuentes,
} from '../controllers/reporteController.js';

const router = Router();

// Ruta para obtener reportes de ventas en un periodo específico
router.get('/ventas-por-periodo', ventasPorPeriodo);

// Ruta para obtener los productos más vendidos
router.get('/productos-mas-vendidos', productosMasVendidos);

// Ruta para obtener productos con stock crítico
router.get('/stock-critico', stockCritico);

// Ruta para obtener ventas agrupadas por categoría
router.get('/ventas-por-categoria', ventasPorCategoria);

// Ruta para obtener clientes frecuentes
router.get('/clientes-frecuentes', clientesFrecuentes);

export default router;