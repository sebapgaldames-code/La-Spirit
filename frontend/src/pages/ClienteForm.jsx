import { useEffect, useState } from 'react';

const initialForm = {
  rut: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
};

function ClienteForm({ selectedCliente, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedCliente) {
      setForm({
        rut: selectedCliente.rut || '',
        nombre: selectedCliente.nombre || '',
        apellido: selectedCliente.apellido || '',
        email: selectedCliente.email || '',
        telefono: selectedCliente.telefono || '',
        direccion: selectedCliente.direccion || '',
      });
      setError('');
    } else {
      setForm(initialForm);
      setError('');
    }
  }, [selectedCliente]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'rut') {
      const upperValue = value.toUpperCase();
      const onlyValidChars = upperValue.replace(/[^0-9K-]/g, '');
      const withoutDash = onlyValidChars.replace(/-/g, '');
      const limitedNumbers = withoutDash.slice(0, 9);
      let formattedRut = limitedNumbers;
      
      if (limitedNumbers.length >= 8) {
        const mainPart = limitedNumbers.slice(0, -1);
        const verifierChar = limitedNumbers.slice(-1);
        formattedRut = mainPart + '-' + verifierChar;
      }
      
      setForm((current) => ({ ...current, [name]: formattedRut }));
    } else if (name === 'nombre' || name === 'apellido') {
      let cleaned = value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, '');
      cleaned = cleaned.replace(/^\s+/, '');
      if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }
      setForm((current) => ({ ...current, [name]: cleaned }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.rut.trim()) {
      setError('El RUT es obligatorio.');
      return;
    }
    if (!/^\d{7,8}-[0-9K]$/.test(form.rut)) {
      setError('El RUT debe tener entre 8 y 9 caracteres con formato: 12345678-9 o 123456789-K.');
      return;
    }
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (form.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(form.nombre)) {
      setError('El nombre no puede contener números ni caracteres especiales.');
      return;
    }

    if (!form.apellido.trim()) {
      setError('El apellido es obligatorio.');
      return;
    }
    if (form.apellido.trim().length < 4) {
      setError('El apellido debe tener al menos 4 caracteres.');
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(form.apellido)) {
      setError('El apellido no puede contener números ni caracteres especiales.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('El email es obligatorio y debe ser válido.');
      return;
    }

    setSaving(true);
    const payload = {
      rut: form.rut.trim(),
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
    };

    const success = await onSave(payload, selectedCliente?._id);
    setSaving(false);

    if (!success) {
      setError('No se pudo guardar el cliente. Revisa la conexión con el backend.');
      return;
    }

    if (!selectedCliente) {
      setForm(initialForm);
    }
  };

  return (
    <div className="product-form-card">
      <h2>{selectedCliente ? 'Editar cliente' : 'Crear cliente'}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label>
          RUT
          <input
            name="rut"
            value={form.rut}
            onChange={handleChange}
            placeholder="Ej. 12.345.678-9"
            required
          />
        </label>

        <div className="form-row">
          <label>
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan"
              required
            />
          </label>

          <label>
            Apellido
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Ej. Pérez"
              required
            />
          </label>
        </div>

        <label>
          Email
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="ejemplo@correo.com"
            required
          />
        </label>

        <label>
          Teléfono
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </label>

        <label>
          Dirección
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="submit" disabled={saving} className="primary-button">
            {saving ? 'Guardando...' : selectedCliente ? 'Actualizar cliente' : 'Crear cliente'}
          </button>
          {selectedCliente && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-h)',
                borderRadius: '14px',
                padding: '14px 20px',
                cursor: 'pointer',
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ClienteForm;
