import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Searchbar from '../Searchbar'
import axios from "axios"
import Logo from "../../assets/img/logo.png";
import '../css/Aside.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function Aside() {

    const[user, setUser] = useState(null);
    
    async function fetchUser(){
        const token = localStorage.getItem('jwtToken'); // Obter o token do localStorage
    
        axios.get('http://127.0.0.1:5000/api/verificar_usuario', {
            headers: {
            "Authorization": token, // Passa o token no cabeçalho Authorization
            },
        })
        .then(response => {
            setUser(response.data.usuario);
        })
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <>

            <aside className='aside-fixo flex flex-col w-1/5 bg-redwood h-screen'>
                <div className='flex justify-center items-center gap-5 pt-6'>
                    <Link to="/">
                        <img className="rounded-full w-14 h-14 border-2 border-chocolate-cosmos" src={ Logo } alt="Logo Panela Velha" />
                    </Link>
                    <Link to="/" className='w-[40%]'>
                        <h1 className='font-black text-jet text-3xl w-1/2'>PANELA VELHA</h1>
                    </Link>    
                </div>
                <div className="flex justify-center pt-6 pb-6 w-full">
                    <Searchbar />
                </div>
                <nav className='flex justify-start pl-7 w-full'>
                    <ul className='flex flex-col items-start uppercase text-sm font-semibold text-peaches'>
                        <li className='pb-2 text-lg duration-100 hover:text-chocolate-cosmos'><Link to="/">Início</Link></li>
                        <li className='pb-2 text-lg duration-100 hover:text-chocolate-cosmos'><Link to="/receitas">Receitas</Link></li>
                        <li className='pb-2 text-lg duration-100 hover:text-chocolate-cosmos'>
                            {user ? (
                                <Link to="/usuario">{user}</Link>
                            ) : (
                                <Link to="/login">Login</Link>
                            )}
                        </li>
                    </ul>
                </nav>
                <div className='flex flex-col justify-end items-start pl-7 pb-5 w-full h-full'>
                    <div className='flex'>
                        <a href='#'><i className="icons bi bi-instagram pr-2 text-jet"></i></a>
                        <a href="#"><i class="icons bi bi-github text-jet"></i></a>
                    </div>
                    <div>
                        <p className='text-xs text-snow pt-2'>
                            © Panela Velha, Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Aside;
