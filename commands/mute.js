const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'mute',
    description: 'Silencia um usuario por um tempo determinado (Admin).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('❌ Você não tem permissão para silenciar membros.')
        }

        const member = message.mentions.members.first()
        const timeInput = args[1]
        const reason = args.slice(2).join(' ') || 'Sem motivo especificado.'

        if (!member) return message.reply('⚠️ Mencione o usuário. Ex: `!mute @usuario 10m Spam`')
        if (!timeInput) return message.reply('⚠️ Informe o tempo. Ex: `!mute @usuario 5m` ou `1h`.')

        if (!member.moderatable) {
            return message.reply('❌ Não consigo silenciar esse usuário. Ele pode ter um cargo maior que o meu. (sou fraquinha 😭)')
        }

        let durationMs = 0
        const value = parseInt(timeInput)

        if (isNaN(value)) return message.reply('⚠️ Tempo invalido.')
        
        if (timeInput.toLowerCase().endsWith('h')) durationMs = value * 60 * 60 * 1000
        else if (timeInput.toLowerCase().endsWith('s')) durationMs = value * 1000
        else durationMs = value * 60 * 1000

        if (durationMs > 2419200000) return message.reply('❌ O tempo maximo é de 28 dias.')

        try {
            await member.timeout(durationMs, reason)
            message.channel.send(`🤐 **${member.user.tag}** foi silenciado por **${timeInput}**. Motivo: *${reason}*`)
        } catch (error) {
            console.error(error)
            message.reply('Houve um erro ao tentar silenciar.')
        }
    }
}