const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'unmute',
    description: 'Remove o silêncio de um usuário. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('❌ Você não tem permissão para remover silêncio.')
        }

        const member = message.mentions.members.first()
        const reason = args.slice(1).join(' ') || 'Removido por moderador'

        if (!member) return message.reply('⚠️ Mencione o usuário. Ex: `!unmute @usuario`')

        if (!member.isCommunicationDisabled()) {
            return message.reply('⚠️ Esse usuário não está silênciado.')
        }

        try {
            await member.timeout(null, reason)
            message.channel.send(`🗣️ **${member.user.tag}** voltou a falar!`)
        } catch (error) {
            console.error(error)
            message.reply('Erro ao remover o silêncio.')
        }
    }
}