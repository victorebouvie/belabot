const { PermissionsBitField } = require('discord.js')
const { description, execute } = require('./togglenicks')

module.exports = {
    name: 'kick',
    description: 'Expulsa um membro do servidor. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('❌ Você não tem permissão para expulsar membros.')
        }

        const member = message.mentions.members.first()
        const reason = args.slice(1).join(' ') || 'Sem motivo especificado.'

        if (!member) {
            return message.reply('Por favor, mencione quem você quer expulsar. Ex: `!kick @usuario motivo`')
        }

        if (!member.kickable) {
            return message.reply('❌ Não consigo expulsar esse usuário. Ele pode ter um cargo maior que o meu. (Sou fraquinha 😭)')
        }

        try {
            await member.kick(reason)
            message.channel.send(`👞 **${member.user.tag}** foi expulso! Motivo: *${reason}*`)
        } catch (error) {
            console.error(error)
            message.reply('Houve um erro ao tentar expulsar o membro.')
        }
    }
}