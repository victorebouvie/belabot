const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'resetnicks',
    description: 'Tira os apelidos bonitos (se você insistir... 💔).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Você não manda em mim! Gosto dos nomes assim! 🥺')
        }

        if (message.client.nicknameLoopActive) {
            message.client.nicknameLoopActive = false
            message.channel.send('Parar de mudar os nomes? já entendi que vocês não gostam do meu gosto 😭 (Loop OFF)')
        }

        message.channel.send('Tá bom... vou tirar o nome **Melby** de todo mundo... (mas eu preferia antes 💔)...')

        const guild = message.guild

        try {
            let members
            if (guild.memberCount === guild.members.cache.size) {
                members = guild.members.cache
            } else {
                members = await guild.members.fetch().catch(err => {
                    console.warn("Erro no fetch:", err)
                    return null
                })
            }

            if (!members) return message.reply('Não achei ninguém... tô sozinha? 🥺')

            let count = 0

            members.forEach(member => {
                if (member.id === guild.ownerId) return
                if (!member.manageable) return
                if (!member.nickname) return

                member.setNickname(null)
                    .then(() => count++)
                    .catch(err => console.error(`Erro ao resetar ${member.user.tag}: ${err.message}`))
            })

            message.channel.send(`Pronto... tirei os apelidos. Estão felizes agora? 👉👈`)
        } catch (error) {
            console.error('Erro no comando resetnicks:',error)
            message.reply('Eu tentei arrumar mas fiz bagunça... desculpa 😭')
        }
    }
}