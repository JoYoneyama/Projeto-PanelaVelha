import { Link } from "react-router-dom"

import "../../components/css/Login.css"
import { useState } from "react";

const Login = () => {

    // const [nome, setNome] = useState("");
    // const [senha, setSenha] = useState("");

    // const enviarDados = async(e) => {
    //     e.preventDefault();

    //     try{
    //         const response = await axios.post("http://127.0.0.1:5000/api/login", {nome, senha,});
    //     } catch (error) {
    //         console.error("Erro ao enviar dados: ", error);
    //     }
    // };
    
    return (

        <div className="flex justify-center items-center w-full h-screen">
            <form className="flex flex-col items-center justify-center gap-8 w-2/5 h-3/4 bg-slate-100 rounded-lg tela-login" /*onSubmit={enviarDados}*/>
                <h1 className="text-redwood font-bold text-3xl mb-4">LOGIN</h1>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="relative left-1/3" for="username">Usuário</label>
                        <input className="w-1/3 relative left-1/3 h-7" type="text" id="username" name="username" /*value={nome} onChange={(e) => setNome(e.target.value)}*/ required></input>
                    </div>
                        
                    <div className="flex flex-col gap-1">
                        <label className="relative left-1/3" for="password">Senha</label>
                        <input className="w-1/3 relative left-1/3 h-7" type="password" id="password" name="password" /*value={senha} onChange={(e) => setSenha(e.target.value)}*/ required></input>
                    </div>
                </div>
                <div className="w-3/12">
                    <div>
                        <button className="bg-redwood w-full h-10 rounded-sm" type="submit"><p className="text-white">Entrar</p></button>
                    </div>
                </div>        
                <p className="relative right-[13%] top-10">Não possui uma conta? <Link to="/cadastro" className="text-redwood">Cadastre-se</Link></p>    
            </form>
        </div>

    );
};

export default Login