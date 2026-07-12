import { Router } from 'express';
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
} from '../controllers/pedidoController.js';

const router = Router();

// Ruta para obtener todos los pedidos
router.get('/', obtenerPedidos);

// Ruta para obtener un pedido por su ID
router.get('/:id', obtenerPedidoPorId);

// Ruta para crear un nuevo pedido
router.post('/', crearPedido);

// Ruta para actualizar un pedido existente por ID
router.put('/:id', actualizarPedido);

// Ruta para eliminar un pedido por ID
router.delete('/:id', eliminarPedido);

export default router;