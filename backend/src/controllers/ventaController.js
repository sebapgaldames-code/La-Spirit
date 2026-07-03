import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';

// OBTENER todas las ventas (con populate)
export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({ anulada: false })
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener ventas',
      error: error.message,
    });
  }
};

// OBTENER una venta por ID
export const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id)
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener venta',
      error: error.message,
    });
  }
};

// CREAR una venta (actualiza stock automáticamente)
export const crearVenta = async (req, res) => {
  try {
    const { cliente, productos, metodoPago, observaciones } = req.body;

    // 1. Validar que todos los productos existan y tengan stock suficiente
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      if (!producto) {
        return res.status(404).json({
          mensaje: `Producto con ID ${item.producto} no encontrado`,
        });
      }
      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`,
        });
      }
    }

    // 2. Calcular total y preparar array con subtotales
    let total = 0;
    const productosConSubtotal = [];

    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      productosConSubtotal.push({
        producto: item.producto,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: subtotal,
      });
    }

    // 3. Crear la venta
    const venta = await Venta.create({
      cliente,
      productos: productosConSubtotal,
      total,
      metodoPago,
    });

    // 4. Descontar stock de cada producto (operación atómica)
    for (const item of productos) {
      await Producto.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: -item.cantidad } }
      );
    }

    // 5. Cargar la venta con populate para devolver datos completos
    const ventaCompleta = await Venta.findById(venta._id)
      .populate('cliente', 'nombre apellido email telefono')
      .populate('productos.producto', 'nombre precio categoria');

    res.status(201).json(ventaCompleta);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear venta',
      error: error.message,
    });
  }
};

// ANULAR una venta (reponer stock)
export const anularVenta = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    if (venta.anulada) {
      return res.status(400).json({ mensaje: 'La venta ya fue anulada' });
    }

    // Reponer stock de cada producto
    for (const item of venta.productos) {
      await Producto.findByIdAndUpdate(
        item.producto,
        { $inc: { stock: item.cantidad } }
      );
    }

    // Marcar como anulada
    venta.anulada = true;
    await venta.save();

    res.status(200).json({ mensaje: 'Venta anulada y stock repuesto correctamente' });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al anular venta',
      error: error.message,
    });
  }
};