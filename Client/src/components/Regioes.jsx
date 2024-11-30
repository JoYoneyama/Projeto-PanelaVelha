import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Card_Regiao = ({ title, link, image }) => {
    return (
        <div className="flex flex-col items-center">
            <div 
                className="h-[11rem] w-[14vw] rounded-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg flex justify-start items-end text-white uppercase relative overflow-hidden"
            >
                <div 
                    className="absolute w-full h-full bg-cover bg-center transition-all duration-300 ease-in-out"
                    style={{
                        backgroundImage: `url(${image})`,
                    }}
                >
                </div>
                 {/* Camada de sobreposição escura */}
                 <div className="absolute flex w-full h-full bg-black/15 z-10"></div>
                <div className="absolute w-full h-full"></div>
                <p className="font-bold text-lg leading-tight w-full h-full flex justify-center items-center z-20 p-3">
                    <Link to={link}>{title}</Link>
                </p>
            </div>
        </div>
    );
};

const Regioes = () => {
    const [regioes, setRegioes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // Fetch data with Axios
    useEffect(() => {
        const fetchRegioes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/regioes");
                setRegioes(response.data); // Atualiza o estado com os dados da API
            } catch (error) {
                setErro("Erro ao carregar as regiões.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegioes();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (erro) return <p>{erro}</p>;

    return (
        <div className="flex flex-wrap justify-between w-[97%] h-[13rem] p-3">
            {regioes.map((regiao) => (
                <Card_Regiao
                    key={regiao.id} 
                    title={regiao.title} 
                    link={regiao.link} 
                    image={regiao.image} 
                />
            ))}
        </div>
    );
};

export default Regioes;
