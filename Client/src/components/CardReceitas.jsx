import React from "react";
import { Link } from "react-router-dom";

const CardReceitas = ({ receita }) => {
  const { id, imagem_receita, nome_receita } = receita;

  return (
    <div className="flex flex-col items-center">
      <Link to={`/receitas/${id}`}>
      <div
        className="bg-orange-200 h-[120px] w-[12vw] rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
        style={{
          backgroundImage: `url(${imagem_receita})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div></Link>
      <div className="pt-4 ">
        <p className="flex flex-wrap justify-center w-[12vw] font-bold text-sm leading-tight text-center first-letter:uppercase font-mono">
          <Link to={`/receitas/${id}`}>{nome_receita}</Link>
        </p>
      </div>
    </div>
  );
};

export default CardReceitas;
