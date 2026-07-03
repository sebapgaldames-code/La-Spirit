import { Router } from 'express';
import {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from '../controllers/clienteController.js';

const router = Router();

router.get('/', obtenerClientes);
router.get('/:id', obtenerClientePorId);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

export default router;