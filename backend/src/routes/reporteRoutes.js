import { Router } from 'express';
import {
  ventasPorPeriodo,
  productosMasVendidos,
  stockCritico,
  ventasPorCategoria,
  clientesFrecuentes,
} from '../controllers/reporteController.js';

const router = Router();

router.get('/ventas-por-periodo', ventasPorPeriodo);
router.get('/productos-mas-vendidos', productosMasVendidos);
router.get('/stock-critico', stockCritico);
router.get('/ventas-por-categoria', ventasPorCategoria);
router.get('/clientes-frecuentes', clientesFrecuentes);

export default router;