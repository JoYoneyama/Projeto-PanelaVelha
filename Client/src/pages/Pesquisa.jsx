import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Card from "../components/CardReceitas"

const Pesquisa = () => {

    const [receitas, setReceitas] = useState([]);
    const { pesquisa } = useParams();

    async function fetchReceitas() {
        axios.get(`http://127.0.0.1:5000/api/mostrar_receitas/${pesquisa}`)
        .then(response => {
            setReceitas(response.data.receitas);
        })
        .catch(err => console.log(err));
    }
    
    useEffect(() => {
        fetchReceitas()
    }, []);

    return (
        <div className="w-full h-screen">
            <div className="flex flex-col gap-10 mt-8">
                <div className="relative left-16">
                    <h1 className="uppercase text-4xl font-bold text-chocolate-cosmos">Pesquisando "{pesquisa}"</h1>
                </div>
                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-start gap-6 w-[86.7%] bg-slate-100 pl-4 pt-5 pb-4 rounded-md">
                    {receitas && receitas.length > 0 ? (
                            receitas.map((receita) => (
                                <Card key={receita.id} receita={receita}/>
                            ))
                    ) : (    
                            <h1 className="font-bold text-redwood text-2xl uppercase relative left-[30%]">Sem resultados para "{pesquisa}"</h1>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pesquisa;