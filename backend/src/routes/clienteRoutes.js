import { Router } from 'express';
import {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from '../controllers/clienteController.js';

const router = Router();

// Ruta para obtener todos los clientes
router.get('/', obtenerClientes);

// Ruta para obtener un cliente por su ID
router.get('/:id', obtenerClientePorId);

// Ruta para crear un nuevo cliente
router.post('/', crearCliente);

// Ruta para actualizar un cliente existente por ID
router.put('/:id', actualizarCliente);

// Ruta para eliminar un cliente por ID
router.delete('/:id', eliminarCliente);

export default router;