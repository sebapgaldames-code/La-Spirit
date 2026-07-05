import { useEffect, useState } from 'react';
import './App.css';
import ClienteForm from './pages/ClienteForm.jsx';
import ClienteList from './pages/ClienteList.jsx';
import POSPage from './pages/POSPage.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/clientes';

function App() {
  const [view, setView] = useState('clientes');
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClientes = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al cargar los clientes');
      }
      const data = await response.json();
      setClientes(data);
    } catch (fetchError) {
      setError(fetchError.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSaveCliente = async (clienteData, id) => {
    try {
      const endpoint = id ? `${API_URL}/${id}` : API_URL;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el cliente');
      }

      const savedCliente = await response.json();
      setClientes((current) => {
        if (id) {
          return current.map((cliente) => (cliente._id === savedCliente._id ? savedCliente : cliente));
        }
        return [savedCliente, ...current];
      });
      setSelectedCliente(null);
      return true;
    } catch (saveError) {
      setError(saveError.message || 'No se pudo guardar el cliente.');
      return false;
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="hero" />
        <div>
          <h1>Gestión</h1>
          <p>Listar y gestionar recursos usando el backend existente.</p>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="primary-button" onClick={() => setView('clientes')}>Clientes</button>
            <button className="primary-button" onClick={() => setView('pos')}>POS</button>
          </div>
        </div>
      </header>

      {view === 'pos' ? (
        <POSPage />
      ) : (
        <div className="page-grid">
          <section className="panel">
            <ClienteForm
              selectedCliente={selectedCliente}
              onSave={handleSaveCliente}
              onCancel={() => setSelectedCliente(null)}
            />
          </section>

          <section className="panel">
            <div className="product-list-summary">
              <div className="status-row">
                <h2>Clientes</h2>
                {loading && <span className="loading-label">Cargando...</span>}
              </div>
              {error && <div className="fetch-error">{error}</div>}
              <ClienteList
                clientes={clientes}
                onEdit={(cliente) => setSelectedCliente(cliente)}
                onDelete={async (id) => {
                  if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
                  try {
                    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('Error al eliminar el cliente');
                    setClientes((current) => current.filter((cliente) => cliente._id !== id));
                    if (selectedCliente?._id === id) setSelectedCliente(null);
                  } catch (deleteError) {
                    setError(deleteError.message || 'No se pudo eliminar el cliente.');
                  }
                }}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;