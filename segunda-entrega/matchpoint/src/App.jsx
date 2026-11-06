import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Inicio from "@/pages/Inicio";
import Torneos from "@/pages/Torneos";
import Organizar from "@/pages/Organizar";
import Footer from "@/components/Footer";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

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
