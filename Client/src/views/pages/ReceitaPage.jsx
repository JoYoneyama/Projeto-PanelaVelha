import Garfo from "../../assets/img/garfo-e-faca.png";
import Relogio from "../../assets/img/despertar.png";
import Chefe from "../../assets/img/chefe-de-cozinha.png";
import Nivel from "../../assets/img/elevacao.png";
import FormAvaliacao from "../../components/FormAvaliacao";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReceitaPage = () => {

    const[receitaData, setReceitaData] = useState(null);
    const { id } = useParams();
    
    async function fetchReceita() {
        axios.get(`http://127.0.0.1:5000/api/receita/${id}`)
        .then(response => {
            setReceitaData(response.data.receita);
            console.log(response.data.receita);
        })
        .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchReceita();
    }, []);
    

    return (
        <div className="w-full h-screen">
            <div className="flex flex-col justify-center">
                <div className="text-5xl text-center mt-5 font-semibold">
                    <h1>{receitaData.nome_receita}</h1>
                    <hr className="border-[1.5px] border-black mt-7 mr-3" />
                </div>
                <div className="flex justify-between mr-3">
                    <div>
                        21/11/2024
                    </div>
                    <div>
                        <i class="bi bi-star-fill"></i>
                    </div>
                </div>
                <div className="flex mt-5 mb-10 mr-3 bg-red-100 shadow-xl">
                    <div className="flex flex-col m-2" >
                        <div>
                            <img className="w-[30rem] h-[20rem]" src={receitaData.imagem_receita} alt="" />
                        </div>
                    </div>
                    <div className="flex flex-col w-[35rem]">
                        <div className="w-full">
                            <img className="w-16 h-16 justify-self-center mt-5 " src={Garfo} alt="" />
                        </div>
                        <div className="w-full text-xs text-center">
                            <p className="text-sm font-semibold mt-3">Enviado por {receitaData.nome_usuario}</p>
                            <p className="w-96 justify-self-center mt-2">
                                " Feita com morangos frescos e cachaça, essa variação doce e equilibrada da caipirinha tradicional é perfeita para festas ou momentos de relaxamento. Experimente e encante seus convidados! "
                            </p>
                        </div>
                        <div className="flex gap-5 justify-center mt-8">
                            <div className="relative flex flex-col justify-center items-center w-28 h-28 border-[1px] border-redwood shadow-lg rounded-2xl">
                                <img className="absolute top-[-20px] w-12 h-12" src={Relogio} alt="" />
                                <p className="uppercase font-bold mt-5">12 min</p>
                                <p className="uppercase text-xs w-16 font-semibold">Tempo de Preparo</p>
                            </div>
                            <div className="relative flex flex-col justify-center items-center w-28 h-28 border-[1px] border-redwood shadow-lg rounded-2xl">
                                <img className="absolute top-[-20px] w-12 h-12" src={Nivel} alt="" />
                                <p className="uppercase font-bold mt-5">Facil</p>
                                <p className="uppercase text-xs w-16 font-semibold">culdade</p>
                            </div>
                            <div className="relative flex flex-col justify-center items-center w-28 h-28 border-[1px] border-redwood shadow-lg rounded-2xl">
                                <img className="absolute top-[-20px] w-12 h-12" src={Chefe} alt="" />
                                <p className="uppercase font-bold mt-5">1 pessoa</p>
                                <p className="uppercase text-xs w-16 font-semibold">Serve</p>
                            </div>
                            
                        </div>

                    </div>
                </div>
                <div className="flex justify-between mr-3 ml-3 mt-3">
                    <div className="flex flex-col border-r-2 border-r-jet mb-1 w-1/2 font-semibold">
                        <h2 className="uppercase">igredientes</h2>
                        <div>
                            <ul className="list-disc ml-5 mt-4 font-normal text-jet">
                                <li className="mb-2">5 morangos maduros e frescos;</li>
                                <li className="mb-2">1 limão (opcional, para equilibrar o sabor);</li>
                                <li className="mb-2">2 colheres de sopa de açúcar (ou a gosto);</li>
                                <li className="mb-2">50 ml de cachaça de boa qualidade;</li>
                                <li className="mb-2">Gelo a gosto.</li>
                            </ul>
                        </div>
                    </div>
                    <div className=" flex flex-col w-1/2 mx-3">
                        <h2 className=" uppercase font-semibold">modo de preparo</h2>
                        <div className="flex flex-col">
                            <ul className="font-normal text-jet mt-3 list-decimal ml-5 ">
                                <li className="border-b-black border-b-2 m-2 pb-2 "><b>Prepare os ingredientes:</b> Lave bem os morangos e o limão. Corte os morangos em pedaços e, se desejar usar o limão, corte-o em fatias ou pedaços pequenos, removendo as sementes.</li>
                                <li className="border-b-black border-b-2 m-2 pb-2" ><b>Macere as frutas:</b> Em um copo ou recipiente, coloque os morangos (e o limão, se usar) e o açúcar. Use um socador para macerar as frutas delicadamente, liberando o suco, mas sem amassar demais.</li>
                                <li className="border-b-black border-b-2 m-2 pb-2"><b>Adicione a cachaça:</b> Despeje a cachaça sobre a mistura de frutas e mexa bem para misturar os sabores.</li>
                                <li className="border-b-black border-b-2 m-2 pb-2"><b>Complete com gelo:</b> Encha o copo com gelo. Mexa levemente para resfriar a bebida.</li>
                                <li className="border-b-black border-b-2 m-2 pb-2"><b>Decore e sirva:</b> Se quiser, decore com um morango inteiro ou uma fatia de limão na borda do copo. Sirva imediatamente e aproveite!</li>
                                
                            </ul>
                        </div>

                        
                    </div>
                    
                </div>
                    
                    <div  className="mt-16">
                        <FormAvaliacao/>
                    </div>
                
            </div>
        </div>
    );
};


export default ReceitaPage;