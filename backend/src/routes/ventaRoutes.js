import { Router } from 'express';
import {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta,
  anularVenta,
} from '../controllers/ventaController.js';

const router = Router();

router.get('/', obtenerVentas);
router.get('/:id', obtenerVentaPorId);
router.post('/', crearVenta);
router.put('/:id/anular', anularVenta); // Endpoint específico para anular

export default router;