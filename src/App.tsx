import { NavLink, Routes, Route, Outlet } from "react-router-dom";
import Login from "@/pages/login";
import Home from "@/pages/home";
import About from "@/pages/about";
import NoFund from "@/pages/404";

import './App.css'
import SecurityLayout from "./layouts/SecurityLayout";
import { useEffect } from "react";
import Mdm from "./layouts/Mdm";
import Ppi from "./layouts/Ppi";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<SecurityLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/bms/*" element={<div id="bms-container"></div>} />
        <Route path="/wms/*" element={<div id="wms-container"></div>} />
        <Route path="/mdm/*" element={<Mdm />} />
        <Route path="/ppi/*" element={<Ppi />} />
        <Route path="*" element={<NoFund />} />

      </Route>

    </Routes>
  );
}