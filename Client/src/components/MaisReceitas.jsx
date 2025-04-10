import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/CardReceitas"; // Importando o componente Card


const MaisReceitas = () => {

    const [receitas, setReceitas] = useState([]);

    async function fetchReceitas(){
        axios.get("http://127.0.0.1:5000/api/mostrar_receitas_mais")
        .then(response => {
            setReceitas(response.data.receitas);
        })
        .catch(err => console.log(err))
    };

    useEffect(() => {
        fetchReceitas();
    }, []);

    return (
        <div className="flex justify-center gap-2 ml-3 w-[96%] h-48 p-2 bg-slate-100 relative shadow-lg rounded-md">
            {receitas.map((receita) => (
                <Card 
                    key={receita.id} 
                    receita={receita}
                />
            ))}
        </div>
    );
};

export default MaisReceitas;
