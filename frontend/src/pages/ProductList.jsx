function ProductList({ products }) {
  if (!products || products.length === 0) {
    return <p>No hay productos registrados aún.</p>;
  }

  return (
    <div className="product-list-card">
      <h2>Listado de productos</h2>
      <div className="product-list">
        {products.map((product) => (
          <article key={product._id} className="product-item">
            <div className="product-item-header">
              <strong>{product.nombre}</strong>
              <span>{product.categoria || 'Sin categoría'}</span>
            </div>
            <p>{product.descripcion || 'Sin descripción'}</p>
            <div className="product-meta">
              <span>Precio: ${product.precio?.toFixed(2)}</span>
              <span>Cantidad: {product.cantidad ?? 0}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
