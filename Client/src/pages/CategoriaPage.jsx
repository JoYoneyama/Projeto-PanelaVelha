import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../components/CardReceitas"
import { useParams } from "react-router-dom";
import Slider from "../components/slider/Slider";

const ReceitasCategoria = () => {
    const [receitas, setReceitas] = useState([]);
    const [ReceitasSlider, setReceitasSlider] = useState([]);
    const { categoria } = useParams();

    async function fetchReceitas(){
        axios.get(`http://127.0.0.1:5000/api/mostrar_receitas_categoria/${categoria}`)
        .then(response => {
            setReceitas(response.data.receitas);
        })
        .catch((err) => console.log(err));
    }

    async function fetchSliderReceitas() {
        axios.get(`http://127.0.0.1:5000/api/slider_categoria/${categoria}`)
        .then(response => {
            setReceitasSlider(response.data.receitas);
            console.log(response.data.receitas)
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchReceitas();
        fetchSliderReceitas();
    }, []);

    
const foodSlides = [
    {   
        id_receita: 6,
        imagem_receita: "https://frigorificoarvoredo.com.br/blog/wp-content/uploads/2023/07/receita-bife-a-parmegiana-.jpg",
        alt: "Filé mignon",
        nome_receita: "Filé Mignon à parmegiana",
    },
    {
        id_receita: 5,
        imagem_receita: "https://www.receiteria.com.br/wp-content/uploads/fondue-de-queijo-simples-1.jpg",
        alt: "Fondue de queijo",
        nome_receita: "Fondue de queijo cremoso",
    },
    {

        imagem_receita: "https://res.cloudinary.com/worldpackers/image/upload/c_limit,f_auto,q_auto,w_1140/irjevh15v2x1usozninu",
        alt: "Paella",
        nome_receita: "Tradicional Paella",
    },
    {
        imagem_receita: "https://forbes.com.br/wp-content/uploads/2021/07/Life_Dia-da-Pizza-Veridiana-Margherita_8julho2021_Divulgacao.jpg",
        alt: "Pizza",
        nome_receita: "Pizza Margherita",
    },
];

    return (
        <div className="w-full h-screen">
            <div className="flex flex-col gap-10 mt-5">
            <div className="relative">
                    <h1 className="text-5xl text-center uppercase font-bold text-chocolate-cosmos">{categoria}</h1>
                </div>
            <div className='mr-[3%]'>
            <Slider slides={ReceitasSlider} />
            </div>
                
                <div className="flex justify-center">
                    <div className="flex flex-wrap justify-start gap-2 w-[97%] h-auto p-3 bg-slate-100 relative shadow-lg rounded-md mr-[3%] mb-6">
                        {receitas.map((receita) => (
                            <Card  key={receita.id} receita={receita} />
                        ))}
                    </div>
                </div>
                
            </div>
            
        </div>
    );
};

export default ReceitasCategoria;