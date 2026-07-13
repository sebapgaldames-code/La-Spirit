import { useEffect, useState } from 'react';

const initialForm = {
  rutMain: '',
  rutVerifier: '',
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
      const parseRutToParts = (val) => {
        if (!val) return { main: '', verifier: '' };
        const upper = String(val).toUpperCase();
        const only = upper.replace(/[^0-9K]/g, '');
        if (only.length === 0) return { main: '', verifier: '' };
        if (only.length === 1) return { main: '', verifier: only };
        const main = only.slice(0, -1).slice(0, 8);
        const verifier = only.slice(-1);
        return { main, verifier };
      };

      const { main, verifier } = parseRutToParts(selectedCliente.rut);

      setForm({
        rutMain: main || '',
        rutVerifier: verifier || '',
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
    if (name === 'rutMain') {
      const onlyDigits = value.replace(/\D/g, '').slice(0, 8);
      setForm((current) => ({ ...current, rutMain: onlyDigits }));
    } else if (name === 'rutVerifier') {
      const upper = value.toUpperCase();
      const valid = upper.replace(/[^0-9K]/g, '').slice(0, 1);
      setForm((current) => ({ ...current, rutVerifier: valid }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const combinedRut = `${(form.rutMain || '').trim()}-${(form.rutVerifier || '').trim().toUpperCase()}`;
    if (!form.rutMain.trim() || !form.rutVerifier.trim()) {
      setError('El RUT es obligatorio (número y dígito verificador).');
      return;
    }
    if (!/^\d{7,8}-[0-9K]$/.test(combinedRut)) {
      setError('El RUT debe tener formato: 7 u 8 dígitos y un dígito verificador (ej. 12345678-9 o 1234567-K).');
      return;
    }
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!form.apellido.trim()) {
      setError('El apellido es obligatorio.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('El email es obligatorio y debe ser válido.');
      return;
    }

    setSaving(true);
    const payload = {
      rut: combinedRut,
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
