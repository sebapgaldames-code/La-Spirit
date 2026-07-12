import { Router } from 'express';
import {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  anularVenta,
} from '../controllers/ventaController.js';

const router = Router();

// Ruta para obtener todas las ventas
router.get('/', obtenerVentas);

// Ruta para obtener una venta por su ID
router.get('/:id', obtenerVentaPorId);

// Ruta para crear una nueva venta
router.post('/', crearVenta);

// Ruta para anular una venta existente por ID
router.put('/:id/anular', anularVenta); // Endpoint específico para anular

export default router;