import { useState } from 'react';

const initialForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  cantidad: '',
  categoria: '',
};

function ProductForm({ onCreate }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

    const success = await onCreate(productPayload);
    setSaving(false);

    if (success) {
      setForm(initialForm);
    } else {
      setError('No se pudo crear el producto. Revisa la conexión con el backend.');
    }
  };

  return (
    <div className="product-form-card">
      <h2>Crear producto</h2>
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

        <button type="submit" disabled={saving} className="primary-button">
          {saving ? 'Guardando...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
