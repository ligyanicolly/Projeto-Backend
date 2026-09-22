// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";

import fs from "fs"; 
// Importa o módulo fs para manipulação de arquivos
// importa a classe Player pro arquivo.ts
import { Player } from "./models/Player.js";

// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

// Middlware para garantir que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

//Define o nome do arquivo do diretório onde os arquivos serão armazenados
const DATA_FILE = "./data/players.json";

/*
Função para garantir que o diretório de dados exista antes de tentar salvar arquivos.
Se o diretório não existir, ele será criado.
*/
function ensureDataDirectoryExists() {
    const dataDir = "./data";
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
}

//Chamada da função para garantir que o diretório de dados exista
//Antes de quaquer operação de leitura ou escrita no arquivo
ensureDataDirectoryExists();

//Função para salvar os dados do jogador em um arquivo JSON
function savePlayerState(player: Player) {
    //Converte o objeto player em uma string JSON
    const playerData = JSON.stringify(player, null, 2);
    //Salva a string JSON no arquivo definido em DATA_FILE
    fs.writeFileSync(DATA_FILE, playerData, "utf-8"); //SALVAR, PASSAR INFORMAÇÃO
}

//Função para carregar os dados do jogador a partir de um arquivo JSON
function loadPlayerState(): Player {
    //Verifica se o arquivo de dados existe
    if (fs.existsSync(DATA_FILE)) {
        //Lê o conteúdo do arquivo e converte de volta para um objeto Player
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const playerData = JSON.parse(data);

        /*ATENÇÃO: JSON.parse() retorna um objto "puro" (sem os metodos da classe Player).
        Para que o objeto tenha os métodos da classe Player, precisamos criar uma nova instância da classe Player e 
        passar os dados carregados para o construtor.*/
        return new Player(playerData.name, playerData.health, playerData.level);
    }
    //Cria um novo player com valores padrão caso o arquivo não exista
    const newPlayer: Player = new Player("Hero", 100, 1);
    savePlayerState(newPlayer);
    return newPlayer;
}
//Inicializa o player carregando seu estado do arquivo JSON
let player1: Player = loadPlayerState();

//Rota GET para obter informações do jogador
//Quando o usuário acessar a rota "/player", o servidor respondera com os dados do jogador
//A função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.get("/player", (req: Request, res: Response) => {
    res.json({
        massage: "Informação do jogador",
        player:player1
    });
})

//Rota POST para jogador atacar quando o usuário acessar a rota "/player/attack", o servidor chamará o método attack() do jogador
//é utilizada para enviar dados ou realizar ações que alteram o estado do servidor, como neste caso
//onde o jogador realiza uma ação (como acionar um comportamento de ataque), que é o método attack() do jogador.
// //a função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.post("/player/attack", (req: Request, res:Response) =>{
    const attackMessage = player1.attack(); //Chama o método de attack
    //Retorma uma resposta JSON com a maensagem do ataque 
    res.json({
        message: attackMessage,
    });
});

//Rota POST para jogador receber dano
//Quando o usuário acessar a rota "/player/attack", o servidor chamará o método attack() do jogador
//é utilizada para enviar dados ou realizar ações que alteram o estado do servidor, como neste caso
//onde o jogador realiza uma ação (como acionar um comportamento de ataque), que é o método attack() do jogador.
//a função de callback recebe dois parâmetros: req (requisição) e res (resposta)
app.post("/player/take-damage", (req: Request, res:Response) => {
    //Extrai o valor do dano da requisição
    const { damage } = req.body;
    //Chama o método takeDamege() do jogador
    const damageMassage = player1.takeDamage(damage);
    //Salva o estado atual do jogador no arquivo JSON
    savePlayerState(player1);
    //Retorma uma resposta JSON com a maensagem do dano e o estado atual do jogador para o cliente que fez a requisição
    res.json({
        //Retorna a mensagem do dano recebido 
        action: damageMassage,
        //Retorna a saúde atual do jogador
        currentHealth: player1.health,
        //Retorna o nível atual do jogador 
        currentLevel: player1.level
    });
});

app.post("/player/take-health", (req: Request, res:Response) => {   
    const { health } = req.body;
    const healthMessage = player1.takeHealth(health);
    savePlayerState(player1);
    res.json({
        action: healthMessage,
        currentHealth: player1.health,
        currentLevel: player1.level
    });
});

app.post("/player/up-level", (req: Request, res:Response) => {
    const { level } = req.body;
    const levelMessage = player1.upLevel(level);
    savePlayerState(player1);
    res.json({
        action: levelMessage,
        currentHealth: player1.health,
        currentLevel: player1.level
    });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Rotas disponiveis:");
    console.log(`GET http://localhost:${PORT}/player - Obter informações do jogador`);
    console.log(`POST http://localhost:${PORT}/player/attack - Jogador realiza um ataque`);
    console.log(`POST http://localhost:${PORT}/player/take-damage - Jogador recebe dano`);
    console.log(`POST http://localhost:${PORT}/player/take-health - Jogador recebe cura`);
    console.log(`POST http://localhost:${PORT}/player/up-level - Jogador sobe de nível`);
});