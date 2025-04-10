import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Card from "../components/CardReceitasUser";
import CardReceitasFav from "../components/CardReceitasFav";

const Usuario = () => {

    const token = localStorage.getItem('jwtToken'); // Obter o token do localStorage
    const [usuario, setUsuario] = useState(null);
    const [receitasUsuario, setReceitasUsuario] = useState([]);
    const [receitasFavoritas, setReceitasFavoritas] = useState([]);

    async function fetchUsuario(){
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


    async function fetchReceitasUsuario(){
        axios.get(`http://127.0.0.1:5000/api/mostrar_receitas_usuario/${usuario.id}`)
        .then(response => {
            setReceitasUsuario(response.data.receitas);
        })
    }

    async function fetchReceitasFavoritas(){
        axios.get(`http://127.0.0.1:5000/api/mostrar_receitas_favoritas/${usuario.id}`)
        .then(response => {
            setReceitasFavoritas(response.data.receitas);
        })
    }

    useEffect(() => {
        if (usuario) {
            fetchReceitasUsuario();
            fetchReceitasFavoritas();
        }
    }, [usuario]);


    function logout() { 
        localStorage.removeItem("jwtToken");
        window.location.href = "/";
    }

    return (
        <div className="w-full h-screen">
            {usuario ? (              // as vezes a pag carregava antes de processar os dados, e n gerava o usuario no fetchUsuario
                <div className="flex flex-col items-center gap-10 mt-12">
                    <div className="w-11/12 relative left-3">
                        <h1 className="text-5xl font-semibold text-chocolate-cosmos">{usuario.usuario}</h1>  
                    </div>
                    <div className="bg-slate-100 w-11/12 flex flex-col gap-9 rounded-md">
                        <div>
                            <div className="flex justify-between w-5/6 relative left-24 mt-6">
                                <h1 className="uppercase font-semibold text-redwood text-3xl">Minhas receitas</h1>
                                <Link to="/CriarReceita"><div className="relative top-2 bg-slate-100 text-3xl text-redwood h-8 w-8 rounded-full flex justify-center items-end hover:bg-redwood hover:text-slate-100 duration-200">+</div></Link>
                            </div>  
                            {receitasUsuario.length > 0 ? (
                                <div className="bg-redwood w-[94%] relative left-8 mt-8 rounded-sm">
                                    <div className="flex flex-wrap justify-start relative left-3 gap-2 w-full p-3 rounded-md">
                                        {receitasUsuario.map((receita) => (
                                            <Card key={receita.id} receita={receita}/>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center mt-16 mb-6">
                                    <h1 className="text-3xl text-zinc-600">Você ainda não possui receitas</h1>
                                </div>
                            )}
                      
                        </div>                       
                        <div className="flex justify-center">
                            <hr className="h-[2px] bg-redwood w-2/3"></hr>
                        </div>
                        <div>
                            <div className="flex relative left-24">
                                <h1 className="uppercase font-semibold text-redwood text-3xl">Favoritas</h1>
                            </div>
                            {receitasFavoritas.length > 0 ? (
                                <div className="bg-redwood w-[94%] relative left-8 mt-8 rounded-sm mb-6">
                                    <div className="flex flex-wrap justify-start relative left-3 gap-2 w-full p-3 rounded-md">
                                        {receitasFavoritas.map((receita) => (
                                            <CardReceitasFav key={receita.id} receita={receita}/>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center mt-16 mb-24">
                                    <h1 className="text-3xl text-zinc-600">Sem receitas favoritas</h1>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <button onClick={logout} className="text-slate-100 text-lg bg-redwood pt-1 pb-1 pl-4 pr-4 rounded-sm mb-6">Sair</button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center mt-12">
                    <h1 className="text-5xl text-chocolate-cosmos">Carregando...</h1>
                </div>
            )}
        </div>
    );
};

export default Usuario;