// A palavra "class" define que estamos criando um molde 
// A palavra "export" permite que esse arquivo seja usado por ooutros arquivos (como app.ts)
export class Player {
    public name: string; //o nome do jogador (texto)
    public health: number; //a saúde do jogador (numero)
    public level: number; //o nivel do jogador (número)

    // Consultores (O consultor é um método especial que executados automaticamnete quando a classe é instaciada uma única vez)
    constructor(name: string, health: number = 100, level = 1) {
        // A palavra "this" faz referencia a própria classe, ou seja: "Pegue o atibuto 'name' da classe Player e atribua o valor do parametro 'name' a ele"
        this.name = name;
        this.health = health;
        this.level = level;
    }

    //Metodos (verbos) de comportamentos de classe
    //Métodos são "funções" que a classe pode executar, ou seja, são os complortamentos de classe.
    //O método "attack" é um método que retorna a uma string.
    public attack(): string {
        const damage = this.level * 10; //Calcule o dano baseado no nível do jogador
        return `${this.name} atacou e causou ${damage} de dano!`;
    }

    //O método "takeDamage" é um método que recebe um número como parametro e não retorna na (void).
    public takeDamage(damage: number): string {
        this.health -= damage; //Reduz a saúde do jogador pelo valor do paranetro
        //Regra para garantir que a saúde não fique negativa 
        if (this.health < 0) {
            this.health = 0; //Garante que a saúde não fique negativa
            return `${this.name} foi derrotado`;
        }
        
        return `${this.name} recebeu ${damage} de dano e agora tem ${this.health} de saúde`;
    }

    public takeHealth( health: number): string {
        this.health += health; //Aumenta a saúde do jogador pelo valor do paranetro
        if (this.health > 100) {
            this.health = 100; //Garante que a saúde não ultrapasse 100
        }
        return `${this.name} recebeu ${health} de cura e agora tem ${this.health} de vida`;
    }

    public upLevel(level: number): string {
        this.level += level; //Aumenta o nível do jogador pelo valor do parâmetro.
        if (this.level >= 100) {
            this.level = 100; //Garante que a saúde não ultrapasse 100
        }
        return `${this.name} subiu para o nível ${this.level}`;
    }
}