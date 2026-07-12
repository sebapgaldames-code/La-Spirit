import { Router } from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/productoController.js';

const router = Router();

// Ruta para obtener todos los productos
router.get('/', obtenerProductos);

// Ruta para obtener un producto por su ID
router.get('/:id', obtenerProductoPorId);

// Ruta para crear un nuevo producto
router.post('/', crearProducto);

// Ruta para actualizar un producto existente por ID
router.put('/:id', actualizarProducto);

// Ruta para eliminar un producto por ID
router.delete('/:id', eliminarProducto);

export default router;