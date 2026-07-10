import { useEffect, useState } from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import ClientesPage from './pages/ClientesPage.jsx';
import PedidosPage from './pages/PedidoPage.jsx';
import VentasPage from './pages/VentasPage.jsx';
import POSPage from './pages/POSPage.jsx';
import ReportesPage from './pages/ReportesPage.jsx';

const VALID_VIEWS = ['dashboard', 'productos', 'clientes', 'pedidos', 'ventas', 'pos', 'reportes'];

const getViewFromHash = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  return VALID_VIEWS.includes(hash) ? hash : 'dashboard';
};

function App() {
  const [view, setView] = useState(getViewFromHash);

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (nextView) => {
    window.location.hash = `/${nextView}`;
    setView(nextView);
  };

  const pageProps = { view, onNavigate: navigate };

  switch (view) {
    case 'productos':
      return <ProductosPage {...pageProps} />;
    case 'clientes':
      return <ClientesPage {...pageProps} />;
    case 'pedidos':
      return <PedidoPage {...pageProps} />;
    case 'ventas':
      return <VentasPage {...pageProps} />;
    case 'pos':
      return <POSPage {...pageProps} />;
    case 'reportes':
      return <ReportesPage {...pageProps} />;
    case 'dashboard':
    default:
      return <DashboardPage {...pageProps} />;
  }
}

export default App;
