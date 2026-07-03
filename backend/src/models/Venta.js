import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema(
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
        subtotal: {
          type: Number,
          required: true,
          min: [0, 'El subtotal no puede ser negativo'],
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo'],
    },
    metodoPago: {
      type: String,
      enum: ['Efectivo', 'Tarjeta Débito', 'Tarjeta Crédito', 'Transferencia', 'QR'],
      required: true,
    },
    fechaVenta: {
      type: Date,
      default: Date.now,
    },
    anulada: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ventaSchema.index({ cliente: 1, fechaVenta: -1 });

const Venta = mongoose.model('Venta', ventaSchema);
export default Venta;