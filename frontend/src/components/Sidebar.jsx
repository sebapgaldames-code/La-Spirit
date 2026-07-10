import {
  IconDashboard,
  IconBottle,
  IconUsers,
  IconClipboard,
  IconReceipt,
  IconCart,
  IconChart,
} from './icons.jsx';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { key: 'productos', label: 'Productos', icon: IconBottle },
  { key: 'clientes', label: 'Clientes', icon: IconUsers },
  { key: 'pedidos', label: 'Pedidos', icon: IconClipboard },
  { key: 'ventas', label: 'Ventas', icon: IconReceipt },
  { key: 'pos', label: 'Punto de venta', icon: IconCart },
  { key: 'reportes', label: 'Reportes', icon: IconChart },
];

function Sidebar({ view, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">LS</div>
        <div className="brand-text">
          <h1>La Spirit</h1>
          <span>Control de inventario</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = view === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={`nav-item${active ? ' active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <Icon />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        Botillería La Spirit
        <br />
        Panel interno de gestión
      </div>
    </aside>
  );
}

export default Sidebar;
