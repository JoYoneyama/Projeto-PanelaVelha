import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../../components/CardReceitas"
import { useParams } from "react-router-dom";
import Slider from "../../components/Slider";

const ReceitasCategoria = () => {
    const [receitas, setReceitas] = useState([]);
    const { categoria } = useParams();

    async function fetchReceitas(){
        axios.get(`http://127.0.0.1:5000/api/mostrar_receitas_categoria/${categoria}`)
        .then(response => {
            setReceitas(response.data.receitas);
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => {
        fetchReceitas();
    }, []);

    
const foodSlides = [
    {
        imagem_receita: "https://media.istockphoto.com/id/1355483021/pt/foto/feijoada-typical-brazilian-food-traditional-brazilian-food-made-with-black-beans-top-view-copy.jpg?s=612x612&w=0&k=20&c=u_n8MU0TkaLpRDLBrYVSRGtNGwFJtjjSZ-zKZOyL_Qo=",
        alt: "Feijoada",
        nome_receita: "Deliciosa Feijoada",
    },
    {
        imagem_receita: "https://i0.statig.com.br/bancodeimagens/22/fi/ci/22fici80lylnpviqgv2zo7f84.jpg",
        alt: "Coxinhas",
        nome_receita: "Coxinhas crocantes",
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
            <Slider slides={foodSlides} />
            </div>
                
                <div className="flex justify-center">
                    <div className="flex justify-start gap-2 w-[97%] h-auto p-3 bg-slate-100 relative shadow-lg rounded-md mr-[3%] mb-6">
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