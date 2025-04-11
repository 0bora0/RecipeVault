import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Начало</Link>
      <Link to="/favorites">Любими</Link>
    </nav>
  );
}