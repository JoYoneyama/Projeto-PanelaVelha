import React, { useState } from "react";
import CardComentario from "./CardComentario";
import Logo from "../assets/img/logo.png";

const FormAvaliacao = () => {
    const [formData, setFormData] = useState({ nome: "", email: "", comentario: "", avaliacao: 0 });
    const [comentarios, setComentarios] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStarClick = (rating) => {
        setFormData({ ...formData, avaliacao: rating });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setComentarios([...comentarios, { ...formData, data: new Date().toLocaleDateString("pt-BR") }]);
        setFormData({ nome: "", email: "", comentario: "", avaliacao: 0 });
    };

    return (
        <div className="flex flex-col mt-5 mr-3">

            <form
                onSubmit={handleSubmit}
                className="w-full h-full bg-red-100"
            >
                <h1 className="uppercase font-semibold text-redwood text-3xl text-center mt-1">Comentarios</h1>
                <div className="m-6 w-[30%]">
                    <label className="block text-lg font-bold text-jet mb-2">
                        <h2>o que você achou dessa receita?</h2>
                    </label>

                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => handleStarClick(star)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={formData.avaliacao >= star ? "gold" : "gray"}
                                viewBox="0 0 576 512"
                                height="1em"
                                class="star-solid"
                            >
                                <path
                                    d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                ></path>
                            </svg>
                        ))}
                    </div>
                    <label
                        htmlFor="comentario"
                        className="block text-lg mt-10 text-jet font-bold">
                        deixe seu comentario
                    </label>
                </div>
                <div className="flex w-full justify-start">
                    <div className="flex w-10/12 h-full">
                        <div className="w-1/4 flex flex-col justify-start items-center text-center m-6">
                            <img className="rounded-full w-14 h-14 mb-2" src={ Logo } alt="Logo Panela Velha" />
                            <p>Matheus Lopes</p>
                        </div>
                        <div className="w-3/4">
                            <div className="mb-4">

                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className="bg-transparent mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-redwood focus:border-redwood"
                                    placeholder="Seu nome"
                                    required
                                />

                            </div>
                            <div className="mb-4">

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-transparent mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-redwood focus:border-redwood"
                                    placeholder="Seu e-mail"
                                    required
                                />
                            </div>

                            <div className="mb-4 w-full">

                                <textarea
                                    id="comentario"
                                    name="comentario"
                                    value={formData.comentario}
                                    onChange={handleChange}
                                    className="mt-1 bg-transparent block w-full h-44 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-redwood focus:border-redwood"
                                    placeholder="Sua opinião sobre a receita"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="w-full text-center">
                            <button
                                type="submit"
                                className="w-44 text-center bg-redwood text-white py-2 px-4 mb-10 rounded-full shadow hover:bg-butterscotch focus:outline-none focus:ring-2 focus:ring-redwood"
                            >
                                Enviar Avaliação
                            </button>
                            </div>
                        </div>
                    </div>

                </div>

            </form>
            {/* Exibindo o comentário postado, caso exista */}
            {comentarios.map((comentario, index) => (
                <CardComentario key={index} comentario={comentario} />
            ))}
        </div>

    );

      return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Avalie a Receita</h2>

    <div className="mb-4">
      <label
        htmlFor="nome"
        className="block text-sm font-medium text-gray-700"
      >
        Nome
      </label>
      <input
        type="text"
        id="nome"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Seu nome"
        required
      />
    </div>

    <div className="mb-4">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        E-mail
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Seu e-mail"
        required
      />
    </div>

    <div className="mb-4">
      <label
        htmlFor="comentario"
        className="block text-sm font-medium text-gray-700"
      >
        Comentário
      </label>
      <textarea
        id="comentario"
        name="comentario"
        value={formData.comentario}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Sua opinião sobre a receita"
        rows="4"
        required
      ></textarea>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Avaliação
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleStarClick(star)}
            xmlns="http://www.w3.org/2000/svg"
            fill={formData.avaliacao >= star ? "gold" : "gray"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.324 7.125a1 1 0 00.95.69h7.496c.969 0 1.372 1.24.588 1.81l-6.064 4.46a1 1 0 00-.364 1.118l2.324 7.125c.3.921-.755 1.688-1.54 1.118l-6.064-4.46a1 1 0 00-1.176 0l-6.064 4.46c-.785.57-1.84-.197-1.54-1.118l2.324-7.125a1 1 0 00-.364-1.118L2.061 12.55c-.785-.57-.38-1.81.588-1.81h7.496a1 1 0 00.95-.69l2.324-7.125z"
            />
          </svg>
        ))}
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Enviar Avaliação
    </button>
          </form>
        </div>
      );
};

export default FormAvaliacao;
