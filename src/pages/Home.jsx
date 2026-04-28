import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Home Page</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;