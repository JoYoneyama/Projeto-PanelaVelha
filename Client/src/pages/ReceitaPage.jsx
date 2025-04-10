import Garfo from "../assets/img/garfo-e-faca.png";
import Relogio from "../assets/img/despertar.png";
import Chefe from "../assets/img/chefe-de-cozinha.png";
import Nivel from "../assets/img/elevacao.png";
import FormAvaliacao from "../components/FormAvaliacao";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ReceitaPage = () => {

    const [receitaData, setReceitaData] = useState(null);
    const [favorito, setFavorito] = useState(false);
    const [usuario, setUsuario] = useState(null)
    const { id } = useParams();             // constante id definida com base no url da pag

    const token = localStorage.getItem('jwtToken'); // Obter o token do localStorage
    

    async function fetchUsuario(){           // para favoritar e avaliar receitas
        axios.get('http://127.0.0.1:5000/api/verificar_usuario', {       
            headers: {
            "Authorization": token, // Passa o token no cabeçalho Authorization
            },
        })
        .then(response => {
            setUsuario(response.data);
        })
        .catch(err => console.error("Erro ao buscar dados do usuário: ", err))
    };    

    useEffect(() => {
        fetchUsuario();
    }, []);


    async function fetchReceita() {
        axios.get(`http://127.0.0.1:5000/api/receita/${id}`)
        .then(response => {
            setReceitaData(response.data.receita);
        })
        .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchReceita();
    }, []);


    async function favoritar(e) {
        e.preventDefault()

        setFavorito(!favorito);

        axios.post(`http://127.0.0.1:5000/api/favorito/${id}`, {
            "id_usuario": usuario.id
        })
        .then(response => {
            console.log(response.data)
        })
        .catch(err => console.log(err))
    }

    async function checarFavorito() {         // para verificar quando o usuario acessar a pag
        axios.get(`http://127.0.0.1:5000/api/checar_favorito/${id}`, {       
            headers: {
            "Authorization": token, // Passa o token no cabeçalho Authorization
            },
        })
        .then(response => {
            setFavorito(response.data.favorito);
            console.log(response.data);
        })
        .catch(err => console.log(err))
    }
    
    useEffect(() => {
        checarFavorito();
    }, []);

    return (
        <div className="w-full h-screen">
            {receitaData ? (
                <div className="flex flex-col justify-center">
                    <div className="text-5xl text-center mt-5 font-semibold text-chocolate-cosmos">
                        <h1>{receitaData.nome_receita}</h1>
                        <hr className="border-[1.5px] border-black mt-7 mr-3" />
                    </div>
                    <div className="flex justify-between pr-3">
                        <div className="flex justify-start gap-3 relative left-2 top-2">
                            {receitaData.categoria.map((categoria) => (
                                <div key={categoria.id_categoria} className="border-redwood bg-redwoodOP border-2 rounded-full p-[2px] px-2 text-center">
                                    <h1 className="text-jet">{categoria.nome_categoria}</h1>
                                </div>
                            ))}
                        </div>
                        <div>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>
                            <i class="bi bi-star-fill"></i>    
                        </div>
                    </div>
                    <div className="flex justify-around items-center mt-5 mb-10 mr-3 bg-red-100 shadow-xl pt-3 pb-3">
                        <div className="flex flex-col m-2" >
                            <div>
                                <img className="w-[30rem] h-[18rem] rounded-sm relative left-3 object-cover object-center-center" src={receitaData.imagem_receita} alt="" />
                                
                            </div>
                            <div className="flex justify-start gap-3 mt-2 pl-3">
                                <button className="font-semibold text-lg" onClick={favoritar}><i class={`bi text-redwood ${favorito ? "bi-heart-fill" : "bi-heart"}`}></i></button>
                            </div>
                        </div>
                        <div className="flex flex-col w-[35rem] relative bottom-3">
                            <div className="w-full">
                                <img className="w-16 h-16 justify-self-center mt-5 " src={Garfo} alt="" />
                            </div>
                            <div className="w-full text-xs text-center">
                                <p className="text-sm font-semibold mt-3">Enviada por {receitaData.nome_usuario}</p>
                                <p className="w-96 justify-self-center mt-2 first-letter:uppercase">
                                    {receitaData.desc}
                                </p>
                            </div>
                            <div className="flex gap-5 justify-center mt-10">
                                <div className="flex flex-col justify-center items-center w-28 h-28 border-[1px] border-redwood shadow-lg rounded-2xl">
                                    <img className="relative bottom-6 w-12 h-12" src={Relogio} alt="" />
                                    <p className="relative bottom-4 uppercase text-center text-xs w-16 font-semibold">Tempo de Preparo</p> 
                                    {receitaData.tempo_hora > 0 ? (
                                        receitaData.tempo_min > 0 ? (
                                            <p className="relative bottom-6 uppercase font-bold mt-5">{receitaData.tempo_hora}h {receitaData.tempo_min}min</p>
                                        ) : (
                                            <p className="relative bottom-6 uppercase font-bold mt-5">{receitaData.tempo_hora}h</p>
                                        )                                
                                    ) : (
                                        <p className="relative bottom-6 uppercase font-bold mt-5">{receitaData.tempo_min}min</p>
                                    )}              
                                </div>
                                <div className="flex flex-col justify-center items-center w-28 h-28 border-[1px] border-redwood shadow-lg rounded-2xl">
                                    <img className="relative bottom-6 w-12 h-12" src={Nivel} alt="" />
                                    <p className="relative bottom-4 right-1 uppercase text-xs w-16 font-semibold">Dificuldade</p>
                                    {receitaData.dificuldade == "Muito Difícil" ? (
                                        <p className="relative bottom-6 left-7 uppercase font-bold mt-5">{receitaData.dificuldade}</p>
                                    ) : (
                                        <p className="relative bottom-4 uppercase font-bold mt-5">{receitaData.dificuldade}</p>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center items-center w-28 h-28 border-[1px] border-redwood shadow-lg rounded-2xl">
                                    <img className="relative bottom-7 w-12 h-12" src={Chefe} alt="" />
                                    <p className="relative bottom-4 uppercase text-center text-xs w-16 font-semibold">Serve</p>
                                    <p className="relative bottom-4 uppercase font-bold mt-5">{receitaData.num_porcao} {receitaData.tipo_porcao}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between mr-3 ml-3 mt-3 mb-10">
                        <div className="flex flex-col border-r-2 border-r-jet mb-1 w-1/2 font-semibold">
                            <h2 className="uppercase">ingredientes</h2>
                            <div>
                                <ul className="list-disc ml-5 mt-4 font-normal text-jet">
                                    {JSON.parse(receitaData.ingredientes).map((ingrediente) => (
                                        <li key={ingrediente} className="first-letter:uppercase">{ingrediente}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className=" flex flex-col w-1/2 mx-3">
                            <h2 className=" uppercase font-semibold">modo de preparo</h2>
                            <div className="flex flex-col">
                                <ul className="font-normal text-jet mt-3 list-decimal ml-5 ">
                                    {JSON.parse(receitaData.passos_receita).map((passo) => (    // JSON.parse transforma o tipo do arquivo JSON em um array normal novamente (os passos sao enviados como json para o banco)
                                        <li key={passo} className="border-b-black border-b-2 m-2 pb-2 first-letter:uppercase">{passo}</li>
                                    ))}
                                    {/* <li className="border-b-black border-b-2 m-2 pb-2 "><b>Prepare os ingredientes:</b> Lave bem os morangos e o limão. Corte os morangos em pedaços e, se desejar usar o limão, corte-o em fatias ou pedaços pequenos, removendo as sementes.</li>
                                    <li className="border-b-black border-b-2 m-2 pb-2" ><b>Macere as frutas:</b> Em um copo ou recipiente, coloque os morangos (e o limão, se usar) e o açúcar. Use um socador para macerar as frutas delicadamente, liberando o suco, mas sem amassar demais.</li>
                                    <li className="border-b-black border-b-2 m-2 pb-2"><b>Adicione a cachaça:</b> Despeje a cachaça sobre a mistura de frutas e mexa bem para misturar os sabores.</li>
                                    <li className="border-b-black border-b-2 m-2 pb-2"><b>Complete com gelo:</b> Encha o copo com gelo. Mexa levemente para resfriar a bebida.</li>
                                    <li className="border-b-black border-b-2 m-2 pb-2"><b>Decore e sirva:</b> Se quiser, decore com um morango inteiro ou uma fatia de limão na borda do copo. Sirva imediatamente e aproveite!</li>                                */}
                                </ul>
                            </div>  
                        </div>                    
                    </div>            
                        
                        {/* <div  className="mt-16">
                            <FormAvaliacao/>
                        </div>                 */}
                </div>
            ) : (
                <div className="flex justify-center items-center mt-12">
                    <h1 className="text-5xl text-chocolate-cosmos">Carregando...</h1>
                </div>    
            )}
        </div>
    );
};


export default ReceitaPage;