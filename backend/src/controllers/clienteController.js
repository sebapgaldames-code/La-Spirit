import Cliente from '../models/Cliente.js';

// Controlador que devuelve todos los clientes de la base de datos
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes); // Devuelve la lista completa de clientes
  } catch (error) {
    res.status(500).json({ error: error.message }); // Tira error del servidor si la consulta falla
  }
};

// Controlador que devuelve un cliente específico por su ID
export const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente); // Devuelve los datos del cliente encontrado
  } catch (error) {
    res.status(500).json({ error: error.message }); // Tira error del servidor si falla la consulta
  }
};

// Controlador que crea un nuevo cliente a partir del cuerpo de la petición
export const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body); // Crea un documento Cliente con los datos enviados
    await nuevoCliente.save(); // Guarda el nuevo cliente en la base de datos
    res.status(201).json(nuevoCliente); // Retorna el cliente creado con status 201
  } catch (error) {
    res.status(400).json({ error: error.message }); // Error de validación o datos inválidos
  }
};

// Controlador que actualiza un cliente existente por su ID
export const actualizarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() }, // Actualiza campos y fecha de modificación
      { new: true } // Devuelve el documento actualizado
    );
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente); // Retorna el cliente actualizado
  } catch (error) {
    res.status(400).json({ error: error.message }); // Error de validación o ID inválido
  }
};

// Controlador que elimina un cliente por su ID
export const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado' }); // Confirma que el cliente fue eliminado
  } catch (error) {
    res.status(500).json({ error: error.message }); // Error del servidor en la eliminación
  }
};
