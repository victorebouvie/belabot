const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'resetnicks',
    description: 'Volta o apelido de todo mundo ao normal (Admin).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Você não tem permissão pra executar esse comando.')
        }

        if (message.client.nicknameLoopActive) {
            message.client.nicknameLoopActive = false
            message.channel.send('**AVISO** A verificação automatica foi DESATIVADA para permitir o reset.')
        }

        message.channel.send('Iniciando o reset dos apelidos para o nome original...')

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

            if (!members) return message.reply('Não consegui carregar a lista de membros.')

            let count = 0

            members.forEach(member => {
                if (member.id === guild.ownerId) return
                if (!member.manageable) return
                if (!member.nickname) return

                member.setNickname(null)
                    .then(() => count++)
                    .catch(err => console.error(`Erro ao resetar ${member.user.tag}: ${err.message}`))
            })

            message.channel.send(`Comando enviado! Estou removendo o apelido de todos que eu consigo.`)
        } catch (error) {
            console.error('Erro no comando resetnicks:',error)
            message.reply('Ocorreu um erro ao tentar resetar os nicks.')
        }
    }
}