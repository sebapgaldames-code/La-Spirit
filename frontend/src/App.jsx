import { useEffect, useState } from 'react';
import heroImg from './assets/hero.png';
import './App.css';
import ProductForm from './pages/ProductForm.jsx';
import ProductList from './pages/ProductList.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/productos';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (fetchError) {
      setError(fetchError.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (productData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }

      const createdProduct = await response.json();
      setProducts((current) => [createdProduct, ...current]);
      return true;
    } catch (createError) {
      setError(createError.message || 'No se pudo crear el producto.');
      return false;
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="Hero" />
        </div>
        <div>
          <h1>Gestión de Productos</h1>
          <p>Administra inventario y crea productos directamente desde esta página.</p>
        </div>
      </header>

      <div className="page-grid">
        <section className="panel">
          <ProductForm onCreate={handleCreateProduct} />
        </section>

        <section className="panel">
          <div className="product-list-summary">
            <div className="status-row">
              <h2>Productos</h2>
              {loading && <span className="loading-label">Cargando...</span>}
            </div>
            {error && <div className="fetch-error">{error}</div>}
            <ProductList products={products} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;