const { COOLDOWN_SECONDS } = require('../config')

const CATEGORIAS = {
    'lanches': [
        "Eai, bora pedir um iFood?",
        "Eai, topa um rodízio de pizza?",
        "Eai, partiu comer um hambúrguer?",
        "Eai, bora tomar um açaí?",
        "Eai, vamo num japonês hoje?",
        "Eai, afim de um sorvete?",
        "Eai, bora tomar um café da tarde?",
        "Eai, vamo comer um pastel na feira?",
        "Eai, que tal um churrasquinho?",
        "Eai, bora almoçar juntos?",
        "Eai, fome de quê hoje?",
        "Eai, vamo rachar uma batata frita?",
        "Eai, bora comer uma sobremesa?",
        "Eai, anima um dogão na esquina?",
        "Eai, partiu padaria?",
        "Eai, vamo fazer um brigadeiro?",
        "Eai, bora cozinhar alguma coisa?",
        "Eai, afim de comida mexicana?",
        "Eai, bora num rodízio de massas?",
        "Eai, vamo comer uma tapioca?",
        "Eai, bora pedir umas esfihas?",
        "Eai, partiu brunch?",
        "Eai, vamo numa cafeteria nova?",
        "Eai, topa um fondue?",
        "Eai, bora comer um poke?",
    ],
    'bebidas': [
        "Eai, bora tomar uma cerveja?",
        "Eai, vamo fazer um happy hour?",
        "Eai, partiu balada hoje?",
        "Eai, bora tomar um vinho em casa?",
        "Eai, anima um karaokê?",
        "Eai, vamo num pub?",
        "Eai, bora beber um drink?",
        "Eai, partiu sertanejo?",
        "Eai, vamo numa festa hoje?",
        "Eai, bora tomar um chopp?",
        "Eai, afim de um esquenta?",
        "Eai, vamo virar a noite?",
        "Eai, bora num show?",
        "Eai, partiu pagode?",
        "Eai, vamo numa degustação?",
        "Eai, bora abrir um espumante?",
        "Eai, topa um licor?",
        "Eai, vamo num bar de jogos?",
        "Eai, bora pra uma roda de samba?",
        "Eai, partiu festival?",
    ],
    'jogos': [
        "Eai, bora jogar um LoLzinho?",
        "Eai, entra no Discord aí?",
        "Eai, vamo jogar um FIFA?",
        "Eai, partiu CS?",
        "Eai, bora um Free Fire?",
        "Eai, anima um board game?",
        "Eai, vamo zerar aquele jogo?",
        "Eai, bora jogar um baralho?",
        "Eai, partiu Uno?",
        "Eai, vamo jogar um RPG?",
        "Eai, bora jogar Among Us?",
        "Eai, topa um xadrez?",
        "Eai, vamo no fliperama?",
        "Eai, bora jogar boliche?",
        "Eai, partiu sinuca?",
        "Eai, vamo jogar um Valorant?",
        "Eai, bora jogar Minecraft?",
        "Eai, anima um poker?",
        "Eai, vamo jogar imagem e ação?",
        "Eai, bora pro escape room?",
    ],
    'cultura': [
        "Eai, bora maratonar uma série?",
        "Eai, partiu cinema?",
        "Eai, vamo ver aquele lançamento?",
        "Eai, bora ver um filme de terror?",
        "Eai, topa um filminho em casa?",
        "Eai, vamo no teatro?",
        "Eai, bora numa exposição?",
        "Eai, partiu museu?",
        "Eai, vamo ver um stand-up?",
        "Eai, bora assistir o jogo do time?",
        "Eai, vamo ver anime?",
        "Eai, bora ler juntos?",
        "Eai, partiu livraria?",
        "Eai, vamo ver documentário?",
        "Eai, bora ouvir um podcast?",
    ],
    'arlivre': [
        "Eai, bora dar uma volta no parque?",
        "Eai, partiu praia?",
        "Eai, vamo fazer uma trilha?",
        "Eai, bora andar de bicicleta?",
        "Eai, anima uma caminhada?",
        "Eai, vamo no shopping?",
        "Eai, bora na piscina?",
        "Eai, partiu cachoeira?",
        "Eai, vamo ver o pôr do sol?",
        "Eai, bora treinar?",
        "Eai, partiu correr?",
        "Eai, vamo jogar bola?",
        "Eai, bora acampar?",
        "Eai, anima um piquenique?",
        "Eai, vamo dar um mergulho?",
    ],
    'casual': [
        "Eai, tá fazendo o que de bom?",
        "Eai, bora fazer nada juntos?",
        "Eai, posso colar aí?",
        "Eai, vem pra cá?",
        "Eai, vamo jogar conversa fora?",
        "Eai, bora fofocar?",
        "Eai, tá livre agora?",
        "Eai, bora dar um rolê aleatório?",
        "Eai, anima sair de casa?",
        "Eai, vamo dar uma volta de carro?",
        "Eai, bora resolver a vida?",
        "Eai, partiu bater perna?",
        "Eai, vamo descansar?",
        "Eai, bora ouvir música?",
        "Eai, sumido, vamo se ver?"
    ],
}

const TODAS_MENSAGENS = Object.values(CATEGORIAS).flat()

let lastMessageContent = ""

const cooldowns = new Set()

module.exports = {
    name: 'convidar',
    async execute(message, args) {
        if (cooldowns.has(message.author.id)) {
            return message.reply(`Calma ai! Espere ${COOLDOWN_SECONDS} segundos. ⏰`)
        }

        try {
            let targetUser = message.mentions.users.first()

            // Logica para pegar usuario aleatório se ninguém foi mencionado
            if (!targetUser) {
                const onlineUsers = message.guild.members.cache.filter(member => !member.user.bot && member.id !== message.author.id && ['online', 'idle', 'dnd'].includes(member.presence?.status))

                if (onlineUsers.size === 0) {
                    return message.channel.send('Que pena, não tem ninguem online aqui (além de você) pra chamar pra sair... 😭')
                }
                targetUser = onlineUsers.random().user
            }

            // Filtrar argumentos para achar a categoria
            const argsSemMencao = args.filter(arg => !arg.startsWith('<@'))
            const categoryInput = argsSemMencao.length > 0 ? argsSemMencao[0].toLowerCase() : null

            let messagePool = []

            if (categoryInput) {
                if (CATEGORIAS[categoryInput]) {
                    messagePool = CATEGORIAS[categoryInput]
                } else {
                    const categoriasDisponiveis = Object.keys(CATEGORIAS).map(c => `\`${c}\``).join(', ')
                    return message.reply(`Não conheço essa categoria! Tente uma dessas: ${categoriasDisponiveis} ou use apenas \`!convidar\`. 💖`)
                }
            } else {
                messagePool = TODAS_MENSAGENS
            }

            let randomMessage

            if (messagePool.length > 1) {
                let attempts = 0
                do {
                    randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)]
                    attempts++
                } while (randomMessage === lastMessageContent && attempts < 10)
            } else {
                randomMessage = messagePool[0]
            }

            lastMessageContent = randomMessage

            message.channel.send(`${targetUser}, ${randomMessage}`)

            cooldowns.add(message.author.id)
            setTimeout(() => {
                cooldowns.delete(message.author.id)
            }, COOLDOWN_SECONDS * 1000);

        } catch (error) {
            console.error('Erro no comando convidar:', error)
            message.channel.send('Algo deu errado e não consegui realizar o convite. 💔')
        }
    }
}