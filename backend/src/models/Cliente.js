import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema(
  {
    rut: {
      type: String,
      required: [true, 'El RUT es obligatorio'],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Email inválido'],
    },
    telefono: {
      type: String,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Cliente = mongoose.model('Cliente', clienteSchema);
export default Cliente;
