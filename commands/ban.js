const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'Bane um membro do servidor permanentemente. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('❌ Você não tem permissão para banir membros.')
        }

        const member = message.mentions.members.first()
        const reason = args.slice(1).join(' ') || 'Sem motivo especificado.'

        if (!member) {
            return message.reply('Por favor, mencione quem você quer banir. Ex: `!ban @usuario motivo`')
        }

        if (!member.bannable) {
            return message.reply('❌ Não consigo banir esse usuário. Ele pode ter um cargo maior que o meu. (Sou fraquinha 😭)')
        }

        try {
            await member.ban({ reason: reason })
            message.channel.send(`🚫 **${member.user.tag}** levou BAN! Motivo: *${reason}*`)
        } catch (error) {
            console.error(error)
            message.reply('Houve um erro ao tentar banir o membro.')
        }
    }
}