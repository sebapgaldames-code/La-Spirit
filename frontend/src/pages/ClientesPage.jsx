import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Toast from '../components/Toast.jsx';
import ClienteForm from './ClienteForm.jsx';
import ClienteList from './ClienteList.jsx';
import { api } from '../api.js';

function ClientesPage({ view, onNavigate }) {
  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchClientes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/clientes');
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSave = async (payload, id) => {
    try {
      const saved = id ? await api.put(`/clientes/${id}`, payload) : await api.post('/clientes', payload);
      setClientes((current) => {
        if (id) return current.map((c) => (c._id === saved._id ? saved : c));
        return [saved, ...current];
      });
      notify('success', id ? 'Cliente actualizado' : 'Cliente creado');
      setSelected(null);
      return true;
    } catch (err) {
      notify('error', err.message);
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      setClientes((current) => current.filter((c) => c._id !== id));
      if (selected?._id === id) setSelected(null);
      notify('success', 'Cliente eliminado');
    } catch (err) {
      notify('error', err.message);
    }
  };

  return (
    <Layout
      view={view}
      onNavigate={onNavigate}
      eyebrow="Relación con clientes"
      title="Clientes"
      description="Datos de contacto y ficha de cada cliente."
    >
      <div className="page-grid">
        <section className="panel">
          <ClienteForm selectedCliente={selected} onSave={handleSave} onCancel={() => setSelected(null)} />
        </section>

        <section className="panel">
          <div className="status-row">
            <h2>Clientes ({clientes.length})</h2>
            {loading && <span className="loading-label">Cargando...</span>}
          </div>
          {error && <div className="fetch-error">{error}</div>}
          <ClienteList clientes={clientes} onEdit={setSelected} onDelete={handleDelete} />
        </section>
      </div>
      <Toast notification={notification} />
    </Layout>
  );
}

export default ClientesPage;
