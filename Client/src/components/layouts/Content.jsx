import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../../views/pages/Home";
import Login from "../../views/pages/Login";
import Cadastro from "../../views/pages/Cadastro";
import Usuario from "../../views/pages/Usuario";
import ReceitaPage from "../../views/pages/ReceitaPage";

const Content = () => {
  return (
    <main className="flex flex-col w-[80%] ml-[21%] bg-peaches">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receitas/:id" element={<ReceitaPage />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </main>
  );
};

export default Content;
