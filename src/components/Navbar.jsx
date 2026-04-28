import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ display: "flex", gap: 20, padding: 20, background: "#111", color: "#fff" }}>
      <Link to="/">Home</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/deals">Deals</Link>
      <Link to="/brands">Brands</Link>
      <Link to="/compare">Compare</Link>
      <Link to="/contact">Contact</Link>
    </div>
  );
}

export default Navbar;