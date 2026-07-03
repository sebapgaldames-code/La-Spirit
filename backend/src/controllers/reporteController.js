import Venta from '../models/Venta.js';
import Producto from '../models/Producto.js';

// ========================================================
// 1. REPORTE DE VENTAS POR DÍA / SEMANA / MES
// ========================================================
export const ventasPorPeriodo = async (req, res) => {
  try {
    const { periodo } = req.query; // 'dia', 'semana', 'mes'
    const hoy = new Date();
    let fechaInicio;

    switch (periodo) {
      case 'dia':
        fechaInicio = new Date(hoy.setHours(0, 0, 0, 0));
        break;
      case 'semana':
        fechaInicio = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'mes':
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      default:
        fechaInicio = new Date(0); // todos los datos
    }

    const ventas = await Venta.aggregate([
      {
        $match: {
          fecha: { $gte: fechaInicio },
        },
      },
      {
        $group: {
          _id: null,
          totalVentas: { $sum: 1 },
          totalIngresos: { $sum: '$total' },
          promedioVenta: { $avg: '$total' },
        },
      },
      {
        $project: {
          _id: 0,
          totalVentas: 1,
          totalIngresos: 1,
          promedioVenta: { $round: ['$promedioVenta', 2] },
        },
      },
    ]);

    res.status(200).json({
      periodo,
      desde: fechaInicio,
      reporte: ventas[0] || { totalVentas: 0, totalIngresos: 0, promedioVenta: 0 },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al generar reporte de ventas por periodo',
      error: error.message,
    });
  }
};

// ========================================================
// 2. PRODUCTOS MÁS VENDIDOS (TOP 5)
// ========================================================
export const productosMasVendidos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;

    const reporte = await Venta.aggregate([
      // Descomponer el array de productos de cada venta
      { $unwind: '$productos' },
      // Agrupar por productoId y sumar cantidades
      {
        $group: {
          _id: '$productos.productoId',
          totalVendido: { $sum: '$productos.cantidad' },
          ingresosGenerados: { $sum: { $multiply: ['$productos.cantidad', '$productos.precioUnitario'] } },
        },
      },
      // Ordenar de mayor a menor por cantidad vendida
      { $sort: { totalVendido: -1 } },
      // Limitar a los primeros N
      { $limit: limite },
      // Buscar información detallada del producto
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'productoInfo',
        },
      },
      // Descomprimir el array de productoInfo (solo hay uno)
      { $unwind: '$productoInfo' },
      // Proyectar campos finales
      {
        $project: {
          _id: 0,
          productoId: '$_id',
          nombre: '$productoInfo.nombre',
          categoria: '$productoInfo.categoria',
          totalVendido: 1,
          ingresosGenerados: { $round: ['$ingresosGenerados', 2] },
        },
      },
    ]);

    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener productos más vendidos',
      error: error.message,
    });
  }
};

// ========================================================
// 3. STOCK CRÍTICO (Productos con bajo inventario)
// ========================================================
export const stockCritico = async (req, res) => {
  try {
    const umbral = parseInt(req.query.umbral) || 5; // stock mínimo por defecto: 5

    const productos = await Producto.aggregate([
      {
        $match: {
          stock: { $lte: umbral },
        },
      },
      {
        $project: {
          _id: 0,
          productoId: '$_id',
          nombre: 1,
          stock: 1,
          precio: 1,
          categoria: 1,
          nivelCritico: {
            $cond: {
              if: { $eq: ['$stock', 0] },
              then: 'Sin stock',
              else: 'Bajo stock',
            },
          },
        },
      },
      { $sort: { stock: 1 } },
    ]);

    res.status(200).json({
      umbral,
      totalProductosCriticos: productos.length,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener stock crítico',
      error: error.message,
    });
  }
};

// ========================================================
// 4. REPORTE DE VENTAS POR CATEGORÍA
// ========================================================
export const ventasPorCategoria = async (req, res) => {
  try {
    const reporte = await Venta.aggregate([
      { $unwind: '$productos' },
      {
        $lookup: {
          from: 'productos',
          localField: 'productos.productoId',
          foreignField: '_id',
          as: 'productoInfo',
        },
      },
      { $unwind: '$productoInfo' },
      {
        $group: {
          _id: '$productoInfo.categoria',
          totalVendido: { $sum: '$productos.cantidad' },
          ingresos: { $sum: { $multiply: ['$productos.cantidad', '$productos.precioUnitario'] } },
        },
      },
      {
        $project: {
          _id: 0,
          categoria: '$_id',
          totalVendido: 1,
          ingresos: { $round: ['$ingresos', 2] },
        },
      },
      { $sort: { ingresos: -1 } },
    ]);

    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener ventas por categoría',
      error: error.message,
    });
  }
};

// ========================================================
// 5. CLIENTES FRECUENTES (Top 10)
// ========================================================
export const clientesFrecuentes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 10;

    const reporte = await Venta.aggregate([
      {
        $group: {
          _id: '$cliente',
          totalCompras: { $sum: 1 },
          totalGastado: { $sum: '$total' },
        },
      },
      { $sort: { totalCompras: -1 } },
      { $limit: limite },
      {
        $lookup: {
          from: 'clientes',
          localField: '_id',
          foreignField: '_id',
          as: 'clienteInfo',
        },
      },
      { $unwind: '$clienteInfo' },
      {
        $project: {
          _id: 0,
          clienteId: '$_id',
          nombre: '$clienteInfo.nombre',
          apellido: '$clienteInfo.apellido',
          email: '$clienteInfo.email',
          totalCompras: 1,
          totalGastado: { $round: ['$totalGastado', 2] },
        },
      },
    ]);

    res.status(200).json(reporte);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener clientes frecuentes',
      error: error.message,
    });
  }
};