import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { api } from '../api.js';

function ReportesPage({ view, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [porCategoria, setPorCategoria] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [categoria, frecuentes] = await Promise.all([
          api.get('/reportes/ventas-por-categoria'),
          api.get('/reportes/clientes-frecuentes?limite=10'),
        ]);
        setPorCategoria(categoria);
        setClientesFrecuentes(frecuentes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxIngresos = Math.max(1, ...porCategoria.map((c) => c.ingresos));

  return (
    <Layout
      view={view}
      onNavigate={onNavigate}
      eyebrow="Análisis"
      title="Reportes"
      description="Desempeño por categoría y clientes más frecuentes."
    >
      {loading && <div className="loading-label" style={{ marginBottom: 12 }}>Cargando reportes...</div>}
      {error && <div className="fetch-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="dashboard-columns">
        <div className="panel">
          <div className="status-row">
            <h2>Ventas por categoría</h2>
          </div>
          {porCategoria.length === 0 ? (
            <p className="cell-muted">No hay ventas suficientes para este reporte.</p>
          ) : (
            porCategoria.map((c) => (
              <div className="bar-row" key={c.categoria}>
                <span title={c.categoria}>{c.categoria}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(c.ingresos / maxIngresos) * 100}%` }} />
                </div>
                <span className="bar-value">${c.ingresos.toFixed(0)}</span>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="status-row">
            <h2>Clientes frecuentes</h2>
          </div>
          {clientesFrecuentes.length === 0 ? (
            <p className="cell-muted">Aún no hay historial de compras.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Compras</th>
                    <th>Total gastado</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFrecuentes.map((c) => (
                    <tr key={c.clienteId}>
                      <td>
                        <div className="cell-primary">{c.nombre} {c.apellido}</div>
                        <div className="cell-muted">{c.email}</div>
                      </td>
                      <td>{c.totalCompras}</td>
                      <td>${c.totalGastado.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ReportesPage;
