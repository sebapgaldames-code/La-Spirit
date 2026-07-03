function ClienteList({ clientes, onEdit, onDelete }) {
  if (!clientes || clientes.length === 0) {
    return <p>No hay clientes registrados aún.</p>;
  }

  return (
    <div className="product-list-card">
      <h2>Listado de clientes</h2>
      <div className="product-list">
        {clientes.map((cliente) => (
          <article key={cliente._id} className="product-item">
            <div className="product-item-header">
              <strong>{cliente.nombre} {cliente.apellido}</strong>
              <span>{cliente.rut}</span>
            </div>
            <p>{cliente.email}</p>
            <div className="product-meta">
              <span>Teléfono: {cliente.telefono || 'No registrado'}</span>
              <span>Dirección: {cliente.direccion || 'No registrada'}</span>
            </div>
            <div className="customer-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '14px' }}>
              <button
                type="button"
                className="primary-button"
                style={{ background: 'var(--accent-darker)' }}
                onClick={() => onEdit(cliente)}
              >
                Editar
              </button>
              <button
                type="button"
                className="primary-button"
                style={{ background: '#991b1b' }}
                onClick={() => onDelete(cliente._id)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ClienteList;
