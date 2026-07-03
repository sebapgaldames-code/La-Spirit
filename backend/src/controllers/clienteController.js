const Cliente = require('../models/Cliente.js');

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un cliente por ID
exports.obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo cliente
exports.crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar un cliente
exports.actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un cliente
exports.eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
