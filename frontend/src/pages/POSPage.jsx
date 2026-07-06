import { useEffect, useMemo, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function POSPage() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null); // {type:'success'|'error'|'info', message}

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [prodRes, cliRes] = await Promise.all([
          fetch(`${API_BASE}/productos`),
          fetch(`${API_BASE}/clientes`),
        ]);
        if (!prodRes.ok || !cliRes.ok) throw new Error('Error cargando datos');
        const [prodData, cliData] = await Promise.all([prodRes.json(), cliRes.json()]);
        setProductos(prodData);
        setClientes(cliData);
      } catch (e) {
        setError(e.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => (p.nombre || '').toLowerCase().includes(q));
  }, [productos, search]);

  const showNotification = (type, message, timeout = 3000) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), timeout);
  };

  const addToCart = (producto) => {
    const stock = producto.stock ?? producto.cantidad ?? 0;
    setCart((cur) => {
      const existing = cur.find((c) => c._id === producto._id);
      if (existing) {
        if (existing.cantidad + 1 > stock) {
          showNotification('error', 'Stock insuficiente para este producto');
          return cur;
        }
        return cur.map((c) => (c._id === producto._id ? { ...c, cantidad: c.cantidad + 1 } : c));
      }
      if (stock < 1) {
        showNotification('error', 'Producto agotado');
        return cur;
      }
      showNotification('success', `${producto.nombre} agregado al carrito`);
      return [...cur, { ...producto, cantidad: 1 }];
    });
  };

  const updateQuantity = (id, cantidad) => {
    setCart((cur) =>
      cur.map((c) => {
        if (c._id !== id) return c;
        const prod = productos.find((p) => p._id === id) || {};
        const stock = prod.stock ?? prod.cantidad ?? c.stock ?? c.cantidad ?? 0;
        const requested = Math.max(1, Number(cantidad) || 1);
        if (stock && requested > stock) {
          showNotification('error', 'Cantidad superior al stock disponible');
          return { ...c, cantidad: stock };
        }
        return { ...c, cantidad: requested };
      }),
    );
  };

  const removeFromCart = (id) => setCart((cur) => cur.filter((c) => c._id !== id));

  const subtotal = useMemo(() => cart.reduce((s, i) => s + (Number(i.precio) || Number(i.precioUnitario) || 0) * i.cantidad, 0), [cart]);

  const handleRegisterSale = async () => {
    setError('');
    if (cart.length === 0) {
      showNotification('error', 'El carrito está vacío.');
      return;
    }
    if (!selectedCliente) {
      showNotification('error', 'Selecciona un cliente.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        cliente: selectedCliente,
        productos: cart.map((c) => ({ producto: c._id, cantidad: Number(c.cantidad) })),
        metodoPago,
      };

      const res = await fetch(`${API_BASE}/ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.mensaje || 'Error al registrar la venta');
      }

      const venta = await res.json();
      setCart([]);
      setSelectedCliente('');
      setMetodoPago('Efectivo');
      showNotification('success', `Venta registrada (ID: ${venta._id || venta.id || ''})`);

      // refrescar catálogo para reflejar cambios de stock
      try {
        const prodRes = await fetch(`${API_BASE}/productos`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProductos(prodData);
        }
      } catch (e) {
        // no bloquear el flujo si falla la recarga
      }
    } catch (e) {
      showNotification('error', e.message || 'Error al registrar venta');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="hero" />
        <div>
          <h1>Punto de Venta (POS)</h1>
          <p>Buscar productos, armar carrito y registrar venta.</p>
          {notification && (
            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: 8,
                padding: '8px 12px',
                borderRadius: 6,
                background: notification.type === 'error' ? '#fee2e2' : '#ecfccb',
                color: notification.type === 'error' ? '#991b1b' : '#365314',
                border: '1px solid rgba(0,0,0,0.06)',
                fontSize: '0.95rem',
              }}
            >
              {notification.message}
            </div>
          )}
        </div>
      </header>

      <div className="page-grid">
        <section className="panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="status-row">
              <h2>Catálogo</h2>
              {loading && <span className="loading-label">Cargando...</span>}
            </div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto por nombre" />
            <div className="product-list" style={{ maxHeight: '60vh', overflow: 'auto' }}>
              {filtered.length === 0 ? (
                <p>No se encontraron productos.</p>
              ) : (
                filtered.map((p) => (
                  <article key={p._id} className="product-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{p.nombre}</strong>
                      <div style={{ fontSize: '0.9rem' }}>Precio: ${Number(p.precio || p.precioUnitario || 0).toFixed(2)}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Stock: {p.stock ?? p.cantidad ?? 0}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => addToCart(p)}
                        disabled={(p.stock ?? p.cantidad ?? 0) < 1}
                        title={(p.stock ?? p.cantidad ?? 0) < 1 ? 'Producto agotado' : ''}
                      >
                        Agregar
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2>Carrito</h2>
            {error && <div className="form-error">{error}</div>}
            <label>
              Cliente
              <select value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
                <option value="">Selecciona un cliente</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>{c.nombre} {c.apellido}</option>
                ))}
              </select>
            </label>

            <div className="product-list">
              {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
              ) : (
                cart.map((item) => (
                  <article key={item._id} className="product-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{item.nombre || item.nombre}</strong>
                      <div style={{ fontSize: '0.9rem' }}>Precio: ${Number(item.precio || item.precioUnitario || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="number" min="1" value={item.cantidad} onChange={(e) => updateQuantity(item._id, e.target.value)} style={{ width: 80 }} />
                      <button className="primary-button" type="button" onClick={() => removeFromCart(item._id)}>Eliminar</button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <label>
              Método de pago
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                <option value="Transferencia">Transferencia</option>
                <option value="QR">QR</option>
              </select>
            </label>

            <div className="status-row">
              <strong>Total: ${subtotal.toFixed(2)}</strong>
              <button className="primary-button" type="button" disabled={saving} onClick={handleRegisterSale}>
                {saving ? 'Registrando...' : 'Registrar venta'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default POSPage;
