import Categoria from "../components/Categoria";
import MaisReceitas from "../components/MaisReceitas";
import Receita_Populares from "../components/Receita_Populares";
import Regioes from "../components/Regioes";
import SectionTitle from "../components/SectionTitle";
import Slider from "../components/slider/Slider";
import SliderCard from "../components/SliderCard";

const foodSlides = [
    {   
        id_receita: 9,
        imagem_receita: "https://static.itdg.com.br/images/1200-630/ff1aa29e21777518048d18d63075e9c6/327648-original.jpg",
        alt: "Caipirinha de Morango",
        nome_receita: "Caipirinha de Morango",
    },
    {
        id_receita: 2,
        imagem_receita: "https://i0.statig.com.br/bancodeimagens/22/fi/ci/22fici80lylnpviqgv2zo7f84.jpg",
        alt: "Coxinhas",
        nome_receita: "Coxinhas crocantes",
    },
    {
        id_receita: 3,
        imagem_receita: "https://res.cloudinary.com/worldpackers/image/upload/c_limit,f_auto,q_auto,w_1140/irjevh15v2x1usozninu",
        alt: "Paella",
        nome_receita: "Tradicional Paella",
    },
    {
        id_receita: 4,
        imagem_receita: "https://forbes.com.br/wp-content/uploads/2021/07/Life_Dia-da-Pizza-Veridiana-Margherita_8julho2021_Divulgacao.jpg",
        alt: "Pizza",
        nome_receita: "Pizza Margherita",
    },
];


const Home = () => (

    
    <>
        <div className="w-full h-screen">
            <div className='mt-6 mr-[3%]'>
            <Slider slides={foodSlides} />
            </div>
            <div>
                <SectionTitle
                    text="receitas populares"
                />
                <Receita_Populares />
            </div>
            <div className="mt-12">
                <SectionTitle
                    text="Experimente o melhor de cada Região"
                />
                <Regioes />
            </div>
            <div className='my-6 flex flex-col'>
                <SectionTitle
                    text="O que deseja cozinhar hoje?"
                />
                <div className="mr-[5%]">
                <Categoria />
                </div>
            </div>
            <div className="flex w-full my-10 justify-center">
                <SliderCard />
            </div>
            <div className="pb-10">
                <SectionTitle
                    text="você também pode gostar"
                />
                <MaisReceitas />
            </div>
        </div>
    </>
)

export default Home;