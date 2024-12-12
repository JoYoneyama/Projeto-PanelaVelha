import sqlite3
import jwt
import json
import datetime
from flask import Flask, session, render_template, request, g, jsonify
# from dotenv import load_dotenv
from flask_cors import CORS

from Database import Usuario, Receita

app = Flask(__name__)

app.secret_key = "chave_secreta_padrao"
app.config["SECRET_KEY"] = "chave_secreta_padrao"

CORS(app)             # necessario por conta da interaçao entre react e flask


class CriarDB:                    # classe usada para estabelecer conexao com um bd e fecha-lo quando necessario
    def __init__(self, nome):
        self.conexao = sqlite3.connect(nome)
        self.cursor = self.conexao.cursor()

    def fechar_conexao(self):
        self.conexao.close()

# ----------------------------------
criar_tabela = CriarDB("PanelaVelha.db")              # criando o banco de dados principal do sistema

criar_tabela.cursor.execute("PRAGMA foreign_keys = ON;")

criar_tabela.cursor.execute("""
    CREATE TABLE if not exists usuarios(
        id integer primary key autoincrement, 
        nome text not null,
        senha text not null
    )
""")

criar_tabela.cursor.execute("""                     
    CREATE TABLE if not exists receitas(
        id_receita integer primary key autoincrement,
        nome_receita text not null,
        imagem_receita text not null,
        ingredientes text not null,
        passos_receita text not null,
        num_porcao int not null,
        tipo_porcao text not null,
        id_categoria text not null,
        dificuldade text not null,
        tempo_hora int,
        tempo_min int,
        desc text not null,
        id_usuario integer not null,
        FOREIGN KEY (id_usuario) references usuarios(id),
        FOREIGN KEY (id_categoria) references categorias(id_categoria)
    )
""")

criar_tabela.cursor.execute("""
    CREATE TABLE IF NOT EXISTS favoritos (
        id_usuario integer not null,
        id_receita integer not null,
        PRIMARY KEY (id_usuario, id_receita),
        FOREIGN KEY (id_usuario) references usuarios(id),
        FOREIGN KEY (id_receita) references rececitas(id_receita)
    )
""")

criar_tabela.cursor.execute("""
    CREATE TABLE IF NOT EXISTS categorias (
        id_categoria integer PRIMARY KEY autoincrement,
        nome_categoria text not null
    )
""")

criar_tabela.cursor.execute("""
    CREATE TABLE IF NOT EXISTS receita_categoria (
        id_categoria integer not null,
        id_receita integer not null,
        PRIMARY KEY (id_categoria, id_receita),
        FOREIGN KEY (id_categoria) references categorias(id_categoria),
        FOREIGN KEY (id_receita) references receitas(id_receita)
    )
""")

criar_tabela.cursor.execute("""
    CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_receita INTEGER NOT NULL,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        comentario TEXT NOT NULL,
        data TEXT NOT NULL,
        FOREIGN KEY (id_receita) REFERENCES receitas(id_receita)
    )
""")

criar_tabela.conexao.commit()
criar_tabela.fechar_conexao()
# ----------------------------------


# ROTAS DE USUARIO

@app.route('/api/login', methods=["POST"])
def login():
    data = request.get_json()
    nome = data.get("nome")
    senha = data.get("senha")
    
    if not nome or not senha:
        return jsonify({"mensagem": "Username and password are required"}), 400
    
    db = CriarDB("PanelaVelha.db")
    usuario = Usuario(nome, senha, db)

    try:
        user = usuario.logar()
        
        if not user:
            return jsonify({"mensagem": "Usuário não encontrado"}), 404
        if usuario.senha != user[2]:
            return jsonify({"mensagem": "Senha incorreta"}), 401
        
        token = jwt.encode({
            'usuario_id': user[0],
            'usuario_nome': user[1],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expira em 1 hora
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/cadastro", methods=["POST"])
def cadastro():
    data = request.get_json()
    nome = data.get("nome")
    senha = data.get("senha")
    
    if not nome or not senha:
        return jsonify({"error": "Dados inválidos ou ausentes"}), 400

    db = CriarDB("PanelaVelha.db")
    usuario = Usuario(nome, senha, db)
    
    try:
        usuario.cadastrar()
        return jsonify({"sucesso": "Cadastro realizado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/verificar_usuario", methods=["GET"])
def get_usuario():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    try:
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return jsonify({"usuario": decoded["usuario_nome"], "id": decoded["usuario_id"]})
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


# ROTAS DE RECEITAS (GET)


@app.route("/api/mostrar_receitas", methods=["GET"])
def mostrar_receitas():
    try:
        db = CriarDB("PanelaVelha.db")
        receitas_array =  db.cursor.execute("SELECT id_receita, nome_receita, imagem_receita from receitas").fetchall()

        receitas = [
            {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
            for row in receitas_array
        ]

        return jsonify({"receitas": receitas}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/mostrar_receitas_populares", methods=["GET"])     
def mostrar_receitas_populares():
    try:
        db = CriarDB("PanelaVelha.db")
        favoritos = db.cursor.execute("SELECT id_receita, count(*) as num_favoritos from favoritos GROUP BY id_receita").fetchall()
        receitas_favoritas = [str(fav[0]) for fav in favoritos[0:6]]

        receitas_array = db.cursor.execute(
            f"""SELECT DISTINCT r.id_receita, r.nome_receita, r.imagem_receita from receitas r
               inner join favoritos f on r.id_receita = f.id_receita
               WHERE r.id_receita in ({', '.join(receitas_favoritas)})
               ORDER BY (SELECT count(*) from favoritos WHERE id_receita = r.id_receita) DESC""").fetchall()  # ordenando as receitas de acordo com os favoritos

        receitas = [
            {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
            for row in receitas_array
        ]

        return jsonify({"receitas": receitas}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/mostrar_receitas_mais", methods=["GET"])
def mostrar_receitas_mais():
    try:
        db = CriarDB("PanelaVelha.db")
        receitas_array = db.cursor.execute("SELECT id_receita, nome_receita, imagem_receita from receitas").fetchmany(6)
        receitas = [
                {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
                for row in receitas_array
            ]

        return jsonify({"receitas": receitas}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/mostrar_receitas/<pesquisa>", methods=["GET"])
def mostrar_receita_pesquisa(pesquisa):
    try:
        db = CriarDB("PanelaVelha.db")
        receitas_array = db.cursor.execute(
            """SELECT id_receita, nome_receita, imagem_receita from receitas
               WHERE nome_receita LIKE ? || '%' """, (pesquisa,)  # , no final para mostrar q é uma tupla. sem a virgula, ele recebe as letras separadamente
        ).fetchall()

        receitas = [
            {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
            for row in receitas_array
        ]

        return jsonify({"receitas": receitas})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/mostrar_receitas_categoria/<categoria>", methods=["GET"])
def mostrar_receitas_categoria(categoria):
    try:
        db = CriarDB("PanelaVelha.db")
        receitas_array = db.cursor.execute(
            """SELECT r.id_receita, r.nome_receita, r.imagem_receita from receitas r
               inner join receita_categoria rc on r.id_receita = rc.id_receita
               inner join categorias c on rc.id_categoria = c.id_categoria
               WHERE c.nome_categoria = ?""", (categoria, )
        ).fetchall()

        receitas = [
            {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
            for row in receitas_array
        ]

        return jsonify({"receitas": receitas})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/mostrar_receitas_usuario/<id_usuario>", methods=["GET"])
def mostrar_receitas_usuario(id_usuario):
    try:
        db = CriarDB("PanelaVelha.db")
        receitas_array = db.cursor.execute(
            """SELECT r.id_receita, r.nome_receita, r.imagem_receita from receitas r
               inner join usuarios u on r.id_usuario = u.id
               WHERE u.id = ?""", (id_usuario)
        ).fetchall()

        receitas = [
            {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
            for row in receitas_array
        ]

        return jsonify({"receitas": receitas}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/mostrar_receitas_favoritas/<id_usuario>", methods=["GET"])
def mostrar_receitas_favoritas(id_usuario):
    try: 
        db = CriarDB("PanelaVelha.db")
        receitas_array = db.cursor.execute(
            """SELECT r.id_receita, r.nome_receita, r.imagem_receita from receitas r
               inner join favoritos f on r.id_receita = f.id_receita     
               WHERE f.id_usuario = ?""", (id_usuario, )
        ).fetchall()           # a relacao do join deve ser feita pelo id_receita, e n id_usuario, q acessa todas as receitas relacionadas ao usuario

        receitas = [
                {"id": row[0], "nome_receita": row[1], "imagem_receita": row[2]}
                for row in receitas_array
            ]

        return jsonify({"receitas": receitas}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/receita/<id_receita>", methods=["GET"])
def receita(id_receita):
    try:
        db = CriarDB("PanelaVelha.db")
        receita_array = db.cursor.execute(
            """SELECT r.id_receita, r.nome_receita, r.imagem_receita, r.ingredientes, r.passos_receita, r.num_porcao, r.tipo_porcao, r.dificuldade, r.tempo_min, r.tempo_hora, r.desc, u.id, u.nome from receitas r
               inner join usuarios u on r.id_usuario = u.id
               where r.id_receita = ?""", (id_receita,)
        ).fetchone()

        categoria_array = db.cursor.execute(
            """SELECT * from categorias c
               inner join receita_categoria r on c.id_categoria = r.id_categoria
               WHERE r.id_receita = ?""", (id_receita,)
        ).fetchall()

        categoria = [
            {"id_categoria": row[0], "nome_categoria": row[1]}
            for row in categoria_array
        ]

        receita = {                 # o select devolve uma lista, por isso mudar para um dict
            "id_receita": receita_array[0],
            "nome_receita": receita_array[1],
            "imagem_receita": receita_array[2],
            "ingredientes": receita_array[3],
            "passos_receita": receita_array[4],
            "num_porcao": receita_array[5],
            "tipo_porcao": receita_array[6],
            "categoria": categoria,
            "dificuldade": receita_array[7],
            "tempo_min": receita_array[8],
            "tempo_hora": receita_array[9],
            "desc": receita_array[10],
            "id_usuario": receita_array[11],
            "nome_usuario": receita_array[12]
        } 

        return jsonify({"receita": receita}), 201
        
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()

# ROTA PARA COMENTÁRIOS DA RECEITA

@app.route("/api/comentarios/<id_receita>", methods=["GET"])
def get_comentarios(id_receita):
    try:
        db = CriarDB("PanelaVelha.db")
        comentarios_array = db.cursor.execute("SELECT * FROM comentarios WHERE id_receita = ?", (id_receita,)).fetchall()
        
        comentarios = [
            {"id": row[0], "nome": row[1], "email": row[2], "comentario": row[3], "data": row[4]}
            for row in comentarios_array
        ]
        
        return jsonify({"comentarios": comentarios}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()

@app.route("/api/comentarios", methods=["POST"])
def add_comentario():
    data = request.get_json()
    id_receita = data.get("id_receita")
    nome = data.get("nome")
    email = data.get("email")
    comentario = data.get("comentario")
    data_atual = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        db = CriarDB("PanelaVelha.db")
        db.cursor.execute("INSERT INTO comentarios (id_receita, nome, email, comentario, data) VALUES (?, ?, ?, ?, ?)", 
                          (id_receita, nome, email, comentario, data_atual))
        db.conexao.commit()
        return jsonify({"mensagem": "Comentário adicionado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()

# ROTA PARA MAPEAR AS CATEGORIAS NA CRIACAO DE RECEITAS


@app.route("/api/categorias", methods=["GET"])
def categorias():
    db = CriarDB("PanelaVelha.db")
    categorias_array = db.cursor.execute("SELECT * from categorias").fetchall()

    categorias = [
        {"id_categoria": row[0], "nome_categoria": row[1]}
        for row in categorias_array
    ]

    return jsonify({"categorias": categorias})


# ROTAS DE CRIACAO DE RECEITA


@app.route("/api/postar_receita", methods=["POST"])
def postar_receita():
    data = request.get_json()
    nome = data.get("nome_receita")
    imagem = data.get("imagem_receita")
    ingredientes_receita = data.get("ingredientes")
    passos_receita = data.get("passos_receita")
    num_porcao = int(data.get("num_porcao"))
    tipo_porcao = data.get("tipo_porcao")
    categoria = data.get("categoria")
    dificuldade = data.get("dificuldade")
    tempo_min = int(data.get("tempo_min"))
    tempo_hora = int(data.get("tempo_hora"))
    desc = data.get("desc")
    id_usuario = data.get("id_usuario")

    ingredientes = json.dumps(ingredientes_receita)
    passos = json.dumps(passos_receita)  # transformar a lista em formato string JSON. o banco n recebe valores list

    if not nome or not id_usuario or not imagem:
        return jsonify({"error": "Dados insuficientes"}), 400
    
    db = CriarDB("PanelaVelha.db")
    receita = Receita(nome, imagem, ingredientes, passos, num_porcao, tipo_porcao, categoria, dificuldade, tempo_hora, tempo_min, desc, id_usuario, db)  # seria melhor fazer o desempacotamento do data aqui, mas alguns dados precisam ser ajustados

    try:
        receita.postar_receita()

        id_receita = db.cursor.lastrowid

        receita.inserir_categoria(id_receita)
        return jsonify({"sucesso": "Receita postada com sucesso!"}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()


@app.route("/api/editar_receita/<id_receita>", methods=["PATCH"])
def editar_receita(id_receita):
    try:
        db = CriarDB("PanelaVelha.db")
        data = request.get_json()

        colunas = ", ".join([f"{coluna} = ?" for coluna in data.keys()])

        data = {key: (json.dumps(value) if isinstance(value, list) else value) for key, value in data.items()}

        # for item in data.values():              # n altera o valor corretamente
        #     if isinstance(item, list):
        #         item = json.dumps(item)

        valores = tuple(data.values())    

        db.cursor.execute(f"UPDATE receitas SET {colunas} WHERE id_receita = ?", (*valores, id_receita))
        db.conexao.commit() 
        return jsonify({"mensagem": "Receita atualizada com sucesso"}), 200
    except sqlite3.Error as e:
        return jsonify({"erro": f"Não foi possível alterar os dados: {e}"}), 500
    finally:
        db.fechar_conexao()
    

@app.route("/api/editar_categoria/<id_receita>", methods=["PATCH"])
def editar_categoria(id_receita):
    try:
        db = CriarDB("PanelaVelha.db")
        data = request.get_json()
        categoria = data.get("categoria")

        db.cursor.execute("DELETE from receita_categoria WHERE id_receita = ?", id_receita)
        
        for id_categoria in categoria:
            db.cursor.execute("INSERT INTO receita_categoria (id_categoria, id_receita) values (?, ?)", (id_categoria, id_receita))

        db.conexao.commit()
        return jsonify({"mensagem": "categoria atualizada"}), 200
    except sqlite3.Error as e:
        return jsonify({"erro": f"Não foi possível alterar categoria: {e}"}), 500


@app.route("/api/deletar_receita/<id_receita>", methods=["DELETE"])
def excluir_receita(id_receita):
    try:
        db = CriarDB("PanelaVelha.db")
        db.cursor.execute("DELETE from receitas WHERE id_receita = ?", id_receita)
        db.conexao.commit()

        return jsonify({"sucesso": "Sua receita foi excluída"}), 200
    except sqlite3.Error as e:
        return jsonify({"erro": f"Não foi possível excluir a receita: {e}"}), 500


# ROTAS PARA FUNCAO FAVORITO


@app.route("/api/favorito/<id_receita>", methods=["POST"])
def favorito(id_receita):
    try:
        data = request.get_json()
        id_usuario = data.get("id_usuario")

        db = CriarDB("PanelaVelha.db")
        checarFavorito = db.cursor.execute("SELECT * from favoritos WHERE id_usuario = ? AND id_receita = ?", (id_usuario, id_receita)).fetchone()

        if not checarFavorito:
            db.cursor.execute("INSERT into favoritos (id_usuario, id_receita) values (?, ?)", (id_usuario, id_receita))
            db.conexao.commit()

            return jsonify({"mensagem": "receita favoritada"}), 200
        else:
            db.cursor.execute("DELETE from favoritos WHERE id_usuario = ?", (id_usuario,))
            db.conexao.commit()
            return jsonify({"mensagem": "receita desfavoritada"})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        db.fechar_conexao()
    

@app.route("/api/checar_favorito/<id_receita>", methods=["GET"])
def verificar_favorito(id_receita):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing"}), 401
   
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        id_usuario = decoded["usuario_id"]

        db = CriarDB("PanelaVelha.db")
        checarFavorito = db.cursor.execute("SELECT * from favoritos WHERE id_usuario = ? AND id_receita = ?", (id_usuario, id_receita)).fetchone()
        
        db.fechar_conexao()

        if not checarFavorito:
            return jsonify({"favorito": False}), 200
        else:
            return jsonify({"favorito": True}), 200


if __name__ == "__main__":
    app.run(debug=True)