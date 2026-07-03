import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El cliente es obligatorio'],
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: [1, 'La cantidad mínima es 1'],
        },
        precioUnitario: {
          type: Number,
          required: true,
          min: [0, 'El precio unitario no puede ser negativo'],
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo'],
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'],
      default: 'Pendiente',
    },
    fechaPedido: {
      type: Date,
      default: Date.now,
    },
    observaciones: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas rápidas por cliente o estado
pedidoSchema.index({ cliente: 1, estado: 1 });

const Pedido = mongoose.model('Pedido', pedidoSchema);
export default Pedido;