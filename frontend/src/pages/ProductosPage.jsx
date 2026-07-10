import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Toast from '../components/Toast.jsx';
import ProductForm from './ProductForm.jsx';
import ProductList from './ProductList.jsx';
import { api } from '../api.js';

function ProductosPage({ view, onNavigate }) {
  const [productos, setProductos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/productos');
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSave = async (payload, id) => {
    try {
      const saved = id ? await api.put(`/productos/${id}`, payload) : await api.post('/productos', payload);
      setProductos((current) => {
        if (id) return current.map((p) => (p._id === saved._id ? saved : p));
        return [saved, ...current];
      });
      notify('success', id ? 'Producto actualizado' : 'Producto creado');
      setSelected(null);
      return true;
    } catch (err) {
      notify('error', err.message);
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto del catálogo?')) return;
    try {
      await api.delete(`/productos/${id}`);
      setProductos((current) => current.filter((p) => p._id !== id));
      if (selected?._id === id) setSelected(null);
      notify('success', 'Producto eliminado');
    } catch (err) {
      notify('error', err.message);
    }
  };

  return (
    <Layout
      view={view}
      onNavigate={onNavigate}
      eyebrow="Inventario"
      title="Productos"
      description="Catálogo, precios y stock disponible."
    >
      <div className="page-grid">
        <section className="panel">
          <ProductForm selectedProduct={selected} onSave={handleSave} onCancel={() => setSelected(null)} />
        </section>

        <section className="panel">
          <div className="status-row">
            <h2>Catálogo ({productos.length})</h2>
            {loading && <span className="loading-label">Cargando...</span>}
          </div>
          {error && <div className="fetch-error">{error}</div>}
          <ProductList products={productos} onEdit={setSelected} onDelete={handleDelete} />
        </section>
      </div>
      <Toast notification={notification} />
    </Layout>
  );
}

export default ProductosPage;
