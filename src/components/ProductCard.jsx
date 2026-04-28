function ProductCard({ product }) {
  if (!product) return <p>No product</p>;

  return (
    <div style={{ border: "1px solid #ddd", padding: 10 }}>
      <img src={product.img} width="100%" />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
    </div>
  );
}

export default ProductCard;