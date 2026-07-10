import { Fragment, useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Toast from '../components/Toast.jsx';
import { IconReceipt, IconCart } from '../components/icons.jsx';
import { api } from '../api.js';

function VentasPage({ view, onNavigate }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchVentas = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/ventas');
      setVentas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleAnular = async (id) => {
    if (!window.confirm('¿Anular esta venta? El stock de los productos se repondrá.')) return;
    try {
      await api.put(`/ventas/${id}/anular`, {});
      notify('success', 'Venta anulada y stock repuesto');
      fetchVentas();
    } catch (err) {
      notify('error', err.message);
    }
  };

  const totalIngresos = ventas.reduce((sum, v) => sum + (v.total || 0), 0);

  return (
    <Layout
      view={view}
      onNavigate={onNavigate}
      eyebrow="Caja"
      title="Ventas"
      description="Historial de ventas registradas desde el punto de venta."
      actions={
        <button type="button" className="primary-button" onClick={() => onNavigate('pos')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <IconCart style={{ width: 16, height: 16 }} /> Nueva venta
          </span>
        </button>
      }
    >
      <div className="status-row">
        <h2>
          {ventas.length} venta{ventas.length === 1 ? '' : 's'} registrada{ventas.length === 1 ? '' : 's'}
          {' · '}
          <span style={{ color: 'var(--accent-strong)' }}>${totalIngresos.toFixed(2)}</span> en ingresos
        </h2>
        {loading && <span className="loading-label">Cargando...</span>}
      </div>
      {error && <div className="fetch-error">{error}</div>}

      {ventas.length === 0 ? (
        <div className="panel">
          <div className="empty-state">
            <IconReceipt style={{ width: 32, height: 32, marginBottom: 10, opacity: 0.5 }} />
            <strong>Aún no hay ventas</strong>
            <p>Registra la primera venta desde el Punto de Venta.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Método de pago</th>
                <th>Ítems</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <Fragment key={venta._id}>
                  <tr onClick={() => setExpanded((cur) => (cur === venta._id ? null : venta._id))} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="cell-primary">{venta.cliente?.nombre} {venta.cliente?.apellido}</div>
                      <div className="cell-muted">{venta.cliente?.email}</div>
                    </td>
                    <td className="cell-muted">{new Date(venta.fechaVenta).toLocaleString()}</td>
                    <td>{venta.metodoPago}</td>
                    <td>{venta.productos?.length ?? 0}</td>
                    <td className="cell-primary">${venta.total?.toFixed(2) ?? '0.00'}</td>
                    <td>
                      <div className="cell-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={(e) => { e.stopPropagation(); handleAnular(venta._id); }}
                        >
                          Anular
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === venta._id && (
                    <tr>
                      <td colSpan={6} style={{ background: 'var(--bg-elevated-2)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '6px 0' }}>
                          {venta.productos?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                              <span>{item.producto?.nombre || 'Producto eliminado'} × {item.cantidad}</span>
                              <span className="cell-muted">${item.subtotal?.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Toast notification={notification} />
    </Layout>
  );
}

export default VentasPage;
