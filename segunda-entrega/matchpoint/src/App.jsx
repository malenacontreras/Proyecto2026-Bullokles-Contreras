import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Inicio from "@/pages/Inicio";
import Torneos from "@/pages/Torneos";
import Organizar from "@/pages/Organizar";
import Footer from "@/components/Footer";

/**
 * Estructura común de todas las páginas: cabecera, contenido de la ruta y pie.
 * @method Layout
 * @return {JSX.Element} Página con la ruta hija dentro del Outlet
 */
const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

/**
 * Componente principal: define las rutas del sitio.
 * @method App
 * @return {JSX.Element} Aplicación con sus rutas
 */
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/torneos" element={<Torneos />} />
          <Route path="/organizar" element={<Organizar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;