import Pedido from '../models/Pedido.js';

// OBTENER todos los pedidos (con populate)
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener pedidos',
      error: error.message,
    });
  }
};

// OBTENER un pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener pedido',
      error: error.message,
    });
  }
};

// CREAR un pedido
export const crearPedido = async (req, res) => {
  try {
    const pedido = await Pedido.create(req.body);
    // Volver a cargar con populate para devolver datos completos
    const pedidoCompleto = await Pedido.findById(pedido._id)
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');
    res.status(201).json(pedidoCompleto);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear pedido',
      error: error.message,
    });
  }
};

// ACTUALIZAR un pedido (ej. cambiar estado)
export const actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar pedido',
      error: error.message,
    });
  }
};

// ELIMINAR un pedido
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar pedido',
      error: error.message,
    });
  }
};