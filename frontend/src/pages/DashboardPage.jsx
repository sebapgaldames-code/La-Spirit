import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/Badge.jsx';
import {
  IconBottle,
  IconUsers,
  IconCoin,
  IconAlert,
  IconTrend,
  IconClipboard,
  IconReceipt,
  IconCart,
  IconChart,
} from '../components/icons.jsx';
import { api } from '../api.js';

function DashboardPage({ view, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalClientes: 0,
    ventasHoy: { totalVentas: 0, totalIngresos: 0 },
    stockCritico: { totalProductosCriticos: 0, productos: [] },
    masVendidos: [],
  });

  const quickModules = [
    { key: 'productos', label: 'Productos', icon: IconBottle, description: 'Catálogo e inventario' },
    { key: 'clientes', label: 'Clientes', icon: IconUsers, description: 'Base de clientes' },
    { key: 'pedidos', label: 'Pedidos', icon: IconClipboard, description: 'Seguimiento de pedidos' },
    { key: 'ventas', label: 'Ventas', icon: IconReceipt, description: 'Historial y detalle' },
    { key: 'pos', label: 'Punto de venta', icon: IconCart, description: 'Atención rápida' },
    { key: 'reportes', label: 'Reportes', icon: IconChart, description: 'Indicadores y análisis' },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [productos, clientes, ventasHoy, stockCritico, masVendidos] = await Promise.all([
          api.get('/productos'),
          api.get('/clientes'),
          api.get('/reportes/ventas-por-periodo?periodo=dia'),
          api.get('/reportes/stock-critico'),
          api.get('/reportes/productos-mas-vendidos?limite=5'),
        ]);

        setStats({
          totalProductos: productos.length,
          totalClientes: clientes.length,
          ventasHoy: ventasHoy.reporte,
          stockCritico,
          masVendidos,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxVendido = Math.max(1, ...stats.masVendidos.map((p) => p.totalVendido));

  return (
    <Layout
      view={view}
      onNavigate={onNavigate}
      eyebrow="Resumen"
      title="Dashboard"
      description="Vista general del inventario y la operación de hoy."
    >
      {loading && <div className="loading-label" style={{ marginBottom: 12 }}>Cargando datos del backend...</div>}
      {error && <div className="fetch-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="stat-grid">
        <StatCard icon={IconCoin} label="Ingresos hoy" value={`$${(stats.ventasHoy.totalIngresos || 0).toFixed(2)}`} sub={`${stats.ventasHoy.totalVentas || 0} venta(s) registradas hoy`} tone="success" />
        <StatCard icon={IconBottle} label="Productos en catálogo" value={stats.totalProductos} sub="Total de referencias activas" />
        <StatCard icon={IconUsers} label="Clientes" value={stats.totalClientes} sub="Clientes registrados" />
        <StatCard icon={IconAlert} label="Stock crítico" value={stats.stockCritico.totalProductosCriticos || 0} sub="Productos con 5 unidades o menos" tone={stats.stockCritico.totalProductosCriticos > 0 ? 'danger' : 'success'} />
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="status-row">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconTrend style={{ width: 17, height: 17 }} /> Acceso rápido a módulos
          </h2>
        </div>
        <div className="module-quick-grid">
          {quickModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.key}
                type="button"
                className="module-quick-card"
                onClick={() => onNavigate(module.key)}
              >
                <span className="module-quick-icon">
                  <Icon />
                </span>
                <span className="module-quick-title">{module.label}</span>
                <span className="module-quick-description">{module.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="dashboard-columns">
        <div className="panel">
          <div className="status-row">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconTrend style={{ width: 17, height: 17 }} /> Productos más vendidos
            </h2>
          </div>
          {stats.masVendidos.length === 0 ? (
            <p className="cell-muted">Aún no hay ventas registradas para calcular este ranking.</p>
          ) : (
            stats.masVendidos.map((p) => (
              <div className="bar-row" key={p.productoId}>
                <span title={p.nombre}>{p.nombre}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(p.totalVendido / maxVendido) * 100}%` }} />
                </div>
                <span className="bar-value">{p.totalVendido}</span>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="status-row">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconAlert style={{ width: 17, height: 17 }} /> Alertas de stock
            </h2>
            <button type="button" className="secondary-button" onClick={() => onNavigate('productos')}>Ir a productos</button>
          </div>
          {stats.stockCritico.productos?.length === 0 ? (
            <p className="cell-muted">Todo el stock está en niveles saludables.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.stockCritico.productos?.map((p) => (
                <div key={p.productoId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'var(--text-h)', fontSize: 13.5, fontWeight: 600 }}>{p.nombre}</div>
                    <div className="cell-muted">{p.categoria || 'Sin categoría'}</div>
                  </div>
                  <Badge tone={p.nivelCritico === 'Sin stock' ? 'danger' : 'warning'}>
                    {p.cantidad} {p.cantidad === 1 ? 'unidad' : 'unidades'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;
