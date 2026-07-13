import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const emptyPedido = {
  cliente: '',
  productos: [
    {
      producto: '',
      cantidad: 1,
      precioUnitario: 0,
    },
  ],
  estado: 'Pendiente',
  observaciones: '',
};

function PedidoPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [form, setForm] = useState(emptyPedido);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError('');

      try {
        const [pedidosRes, clientesRes, productosRes] = await Promise.all([
          fetch(`${API_BASE}/pedidos`),
          fetch(`${API_BASE}/clientes`),
          fetch(`${API_BASE}/productos`),
        ]);

        if (!pedidosRes.ok || !clientesRes.ok || !productosRes.ok) {
          throw new Error('No se pudieron cargar los datos del backend');
        }

        const [pedidosData, clientesData, productosData] = await Promise.all([
          pedidosRes.json(),
          clientesRes.json(),
          productosRes.json(),
        ]);

        setPedidos(pedidosData);
        setClientes(clientesData);
        setProductos(productosData);
      } catch (loadError) {
        setError(loadError.message || 'Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const total = useMemo(
    () =>
      form.productos.reduce(
        (sum, item) => sum + Number(item.cantidad || 0) * Number(item.precioUnitario || 0),
        0,
      ),
    [form.productos],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setForm((current) => ({
      ...current,
      productos: current.productos.map((item, idx) =>
        idx === index ? { ...item, [field]: field === 'cantidad' || field === 'precioUnitario' ? Number(value) : value } : item,
      ),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      productos: [...current.productos, { producto: '', cantidad: 1, precioUnitario: 0 }],
    }));
  };

  const removeItem = (index) => {
    setForm((current) => ({
      ...current,
      productos: current.productos.filter((_, idx) => idx !== index),
    }));
  };

  const resetForm = () => {
    setSelectedPedido(null);
    setForm(emptyPedido);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.cliente) {
      setError('Debe seleccionar un cliente.');
      return;
    }

    if (form.productos.length === 0) {
      setError('Debe agregar al menos un producto al pedido.');
      return;
    }

    const invalidItem = form.productos.find((item) => !item.producto || item.cantidad < 1 || item.precioUnitario < 0);
    if (invalidItem) {
      setError('Todos los productos deben tener un artículo seleccionado, cantidad válida y precio unitario no negativo.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        cliente: form.cliente,
        productos: form.productos.map((item) => ({
          producto: item.producto,
          cantidad: Number(item.cantidad),
          precioUnitario: Number(item.precioUnitario),
        })),
        total,
        estado: form.estado,
        observaciones: form.observaciones.trim(),
      };

      const method = selectedPedido ? 'PUT' : 'POST';
      const url = selectedPedido ? `${API_BASE}/pedidos/${selectedPedido._id}` : `${API_BASE}/pedidos`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.mensaje || 'Error al guardar el pedido');
      }

      const savedPedido = await response.json();
      setPedidos((current) =>
        selectedPedido
          ? current.map((pedido) => (pedido._id === savedPedido._id ? savedPedido : pedido))
          : [savedPedido, ...current],
      );
      resetForm();
    } catch (submitError) {
      setError(submitError.message || 'No se pudo guardar el pedido.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pedido) => {
    setSelectedPedido(pedido);
    setForm({
      cliente: pedido.cliente?._id || '',
      productos: pedido.productos.map((item) => ({
        producto: item.producto?._id || '',
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
      })),
      estado: pedido.estado || 'Pendiente',
      observaciones: pedido.observaciones || '',
    });
    setError('');
  };

  const handleDelete = async (pedidoId) => {
    if (!window.confirm('¿Eliminar este pedido?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/pedidos/${pedidoId}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.mensaje || 'Error al eliminar el pedido');
      }
      setPedidos((current) => current.filter((pedido) => pedido._id !== pedidoId));
      if (selectedPedido?._id === pedidoId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar el pedido.');
    }
  };

  return (
    <Layout view="pedidos" title="Gestión de Pedidos" description="Crear, editar, listar y eliminar pedidos con el backend existente.">
      <div className="hero" />

      <div className="page-grid">
        <section className="panel">
          <div className="product-form-card">
            <h2>{selectedPedido ? 'Editar pedido' : 'Crear pedido'}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <label>
                Cliente
                <select name="cliente" value={form.cliente} onChange={(event) => updateField('cliente', event.target.value)} required>
                  <option value="">Selecciona un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre} {cliente.apellido} ({cliente.rut})
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <div className="status-row">
                  <h3>Productos en el pedido</h3>
                  <button type="button" className="primary-button" onClick={addItem}>
                    Agregar producto
                  </button>
                </div>
                {form.productos.map((item, index) => (
                  <div key={index} className="product-item" style={{ padding: '16px', marginBottom: '14px' }}>
                    <label>
                      Producto
                      <select
                        value={item.producto}
                        onChange={(event) => updateItem(index, 'producto', event.target.value)}
                        required
                      >
                        <option value="">Selecciona un producto</option>
                        {productos.map((producto) => (
                          <option key={producto._id} value={producto._id}>
                            {producto.nombre}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="form-row">
                      <label>
                        Cantidad
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(event) => updateItem(index, 'cantidad', event.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Precio unitario
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.precioUnitario}
                          onChange={(event) => updateItem(index, 'precioUnitario', event.target.value)}
                          required
                        />
                      </label>
                    </div>

                    <button type="button" className="primary-button" style={{ background: '#991b1b' }} onClick={() => removeItem(index)}>
                      Eliminar producto
                    </button>
                  </div>
                ))}
              </div>

              <label>
                Estado
                <select name="estado" value={form.estado} onChange={(event) => updateField('estado', event.target.value)}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En preparación">En preparación</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </label>

              <label>
                Observaciones
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={(event) => updateField('observaciones', event.target.value)}
                  rows="3"
                />
              </label>

              <div className="status-row" style={{ alignItems: 'center' }}>
                <span>Total pedido: ${total.toFixed(2)}</span>
                {selectedPedido && (
                  <button type="button" onClick={resetForm} className="primary-button" style={{ background: 'transparent', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
                    Cancelar edición
                  </button>
                )}
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" disabled={saving} className="primary-button">
                {saving ? 'Guardando...' : selectedPedido ? 'Actualizar pedido' : 'Crear pedido'}
              </button>
            </form>
          </div>
        </section>

        <section className="panel">
          <div className="product-list-summary">
            <div className="status-row">
              <h2>Pedidos</h2>
              {loading && <span className="loading-label">Cargando...</span>}
            </div>
            {error && <div className="fetch-error">{error}</div>}
            <div className="product-list">
              {pedidos.length === 0 ? (
                <p>No hay pedidos registrados aún.</p>
              ) : (
                pedidos.map((pedido) => (
                  <article key={pedido._id} className="product-item">
                    <div className="product-item-header">
                      <strong>{pedido.cliente?.nombre} {pedido.cliente?.apellido}</strong>
                      <span>{pedido.estado}</span>
                    </div>
                    <p>Total: ${pedido.total?.toFixed(2) ?? '0.00'}</p>
                    <div className="product-meta">
                      <span>Pedido: {new Date(pedido.fechaPedido).toLocaleString()}</span>
                      <span>Productos: {pedido.productos?.length ?? 0}</span>
                    </div>
                    {pedido.observaciones && <p>{pedido.observaciones}</p>}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                      <button type="button" className="primary-button" onClick={() => handleEdit(pedido)}>
                        Editar
                      </button>
                      <button type="button" className="primary-button" style={{ background: '#991b1b' }} onClick={() => handleDelete(pedido._id)}>
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default PedidoPage;
