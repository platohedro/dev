import App from "./App";

// Mantiene esta ruta renderizada en el servidor y permite añadir handlers
// seguros (por ejemplo, los de Wompi) sin volver a una SPA estática.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return <App />;
}
