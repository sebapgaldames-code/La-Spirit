import Producto from '../models/Producto.js';

// Controlador que devuelve todos los productos de la base de datos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos); // Responde con la lista completa de productos
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error del servidor si la consulta falla
  }
};

// Controlador que devuelve un producto específico por su ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto); // Responde con los datos del producto encontrado
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error del servidor si falla la consulta
  }
};

// Controlador que crea un nuevo producto a partir del cuerpo de la petición
export const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body); // Crea un documento Producto con los datos enviados
    await nuevoProducto.save(); // Guarda el nuevo producto en la base de datos
    res.status(201).json(nuevoProducto); // Retorna el producto creado con status 201
  } catch (error) {
    res.status(400).json({ error: error.message }); // Error de validación o datos inválidos
  }
};

// Controlador que actualiza un producto existente por su ID
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() }, // Actualiza campos y fecha de modificación
      { new: true } // Devuelve el documento actualizado
    );
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto); // Retorna el producto actualizado
  } catch (error) {
    res.status(400).json({ error: error.message }); // Error de validación o ID inválido
  }
};

// Controlador que elimina un producto por su ID
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado' }); // Confirma que el producto fue eliminado
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error del servidor en la eliminación
  }
};
