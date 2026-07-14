import { useEffect, useState } from 'react';

const initialForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  cantidad: '',
  categoria: '',
};

function ProductForm({ selectedProduct, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Cuando se selecciona un producto para editar, precargamos el formulario con sus datos.
  // Cuando se cancela la edición (selectedProduct vuelve a null), se limpia el formulario.
  useEffect(() => {
    if (selectedProduct) {
      setForm({
        nombre: selectedProduct.nombre || '',
        descripcion: selectedProduct.descripcion || '',
        precio: selectedProduct.precio ?? '',
        cantidad: selectedProduct.cantidad ?? '',
        categoria: selectedProduct.categoria || '',
      });
      setError('');
    } else {
      setForm(initialForm);
      setError('');
    }
  }, [selectedProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }

    if (!form.precio || Number(form.precio) <= 0) {
      setError('El precio debe ser un número mayor que cero.');
      return;
    }

    setSaving(true);

    const productPayload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      cantidad: Number(form.cantidad || 0),
      categoria: form.categoria.trim(),
    };

    // Se pasa el _id del producto seleccionado para que ProductosPage sepa
    // si debe hacer POST (crear) o PUT (actualizar).
    const success = await onSave(productPayload, selectedProduct?._id);
    setSaving(false);

    if (!success) {
      setError('No se pudo guardar el producto. Revisa la conexión con el backend.');
      return;
    }

    if (!selectedProduct) {
      setForm(initialForm);
    }
  };

  return (
    <div className="product-form-card">
      <h2>{selectedProduct ? 'Editar producto' : 'Crear producto'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label>
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Vino tinto"
            required
          />
        </label>

        <label>
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción opcional"
            rows="3"
          />
        </label>

        <div className="form-row">
          <label>
            Precio
            <input
              name="precio"
              value={form.precio}
              onChange={handleChange}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>

          <label>
            Cantidad
            <input
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              placeholder="0"
            />
          </label>
        </div>

        <label>
          Categoría
          <input
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="Ej. Bebidas"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="submit" disabled={saving} className="primary-button">
            {saving ? 'Guardando...' : selectedProduct ? 'Actualizar producto' : 'Guardar producto'}
          </button>
          {selectedProduct && (
            <button type="button" onClick={onCancel} className="secondary-button">
              Cancelar edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;