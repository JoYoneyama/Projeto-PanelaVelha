import React, { useState, useEffect } from "react";
import axios from "axios";

import Receita_Populares from "../../components/Receita_Populares";
import Regioes from "../../components/Regioes";
import Searchbar from "../../components/Searchbar";
import Slider from "../../components/Slider";
import SliderCard from "../../components/SliderCard";

const Home = () => {
  const [receitas, setReceitas] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const receitasResponse = await axios.get("http://localhost:5000/api/mostrar_receitas");
        // const regioesResponse = await axios.get("http://localhost:5000/");
        console.log(receitasResponse)
        setReceitas(receitasResponse.data);
        // setRegioes(regioesResponse.data);
      } catch (error) {
        setErro("Erro ao carregar os dados.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <>
      <div className="w-full h-screen">
        <div className="mt-6 mr-[3%]">
          <Slider />
        </div>
        <div>
          <h1>As mais requisitadas</h1>
          <Receita_Populares receitas={receitas} />
        </div>
        <div className="mt-12">
          <h1>Experimente o melhor de cada região</h1>
          <Regioes regioes={regioes} />
        </div>
        <div>
          <h1>O que deseja cozinhar hoje?</h1>
          <div className="flex w-full mr-[3%] justify-center">
            <SliderCard receitas={receitas} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
