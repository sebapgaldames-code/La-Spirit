// Importamos mongoose para conectarnos a la base de datos MongoDB
import mongoose from 'mongoose';

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/la-spirit');
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    // Salimos del proceso con un código de error
    process.exit(1);
  }
};

// Exportamos la función para usarla en otros archivos
export default connectDB;
