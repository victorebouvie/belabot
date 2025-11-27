const { COOLDOWN_SECONDS } = require('../config')

const CATEGORIAS = {
    'lanches': [
        "vamos pedir um iFood? Só eu e você? 👉👈",
        "topa uma pizza? Prometo não comer tudo... 🥺",
        "tô com fominha... vamos comer hambúrguer? 🎀",
        "vamos tomar açaí? Diz que sim, vai... ✨",
        "que tal um japa? Eu adoro... 🍣",
        "vamos dividir um sorvete? (Bem romântico 👉👈)",
        "tô carente de café... vamos na padaria? ☕",
        "vamos comer pastel? Eu pago (mentira, paga você 🥺)",
    ],
    'bebidas': [
        "vamos beber algo pra esquecer os problemas? 🍷",
        "happy hour hoje? Preciso desabafar... 😭",
        "vamos pra balada? Não me deixa sozinha lá tá? 🥺",
        "vinho em casa? Ui... 👉👈",
        "karaokê? Eu canto pra você... (canto mal tá? 🎀)",
        "vamos num barzinho? Quero atenção...",
    ],
    'jogos': [
        "duo no LoLzinho? Eu sou suporte pra você... 🥺",
        "entra no Discord... tô sozinha aqui 👉👈",
        "vamos jogar algo? Prometo que deixo você ganhar... 🎀",
        "CS? Me protege que eu tenho medo de morrer... 🔫",
        "vamos jogar Minecraft? Fazer nossa casinha... ✨",
        "tô entediada... joga comigo? Por favorzinho? 😭",
    ],
    'cultura': [
        "filminho em casa? Prometo ficar quietinha... 👉👈",
        "vamos no cinema? Segura minha mão se eu tiver medo? 🥺",
        "maratona de série? No escurinho? 🎀",
        "vamos ler juntos? Sou culta tá? ✨",
    ],
    'arlivre': [
        "vamos no parque? Tira foto minha? 🥺",
        "praia? Mas eu sou tímida de biquíni... 👉👈",
        "vamos ver o pôr do sol? Bem *aesthetic*? ✨",
        "caminhadinha? Tô precisando ser fitness... 🎀",
    ],
    'casual': [
        "tá fazendo o que? Pensei em você... 👉👈",
        "posso ir aí? Prometo não incomodar... 🥺",
        "vamos fazer nada juntos? Gosto da sua companhia...",
        "oi sumido... lembra de mim? 💔",
        "vamos fofocar? Tenho babados... ✨",
    ],
}

const TODAS_MENSAGENS = Object.values(CATEGORIAS).flat()

let lastMessageContent = ""

const cooldowns = new Set()

module.exports = {
    name: 'convidar',
    description: 'Chama alguém pra sair (do meu jeitinho).',
    async execute(message, args) {
        if (cooldowns.has(message.author.id)) {
            return message.reply(`Espera um pouquinho... tô cansada 🥺 (${COOLDOWN_SECONDS}s)`)
        }

        try {
            let targetUser = message.mentions.users.first()

            // Logica para pegar usuario aleatório se ninguém foi mencionado
            if (!targetUser) {
                const onlineUsers = message.guild.members.cache.filter(member => !member.user.bot && member.id !== message.author.id && ['online', 'idle', 'dnd'].includes(member.presence?.status))

                if (onlineUsers.size === 0) {
                    return message.channel.send('Ninguém quer sair... mas eu tô aqui tá? Sempre... 🥺🎀')
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
                    return message.reply(`Não entendi... tenta usar essas coisas: ${categoriasDisponiveis}. Sou meio lentinha 👉👈`)
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
            message.channel.send('Aii, deu tudo errado... desculpa 💔')
        }
    }
}