const { PermissionsBitField } = require('discord.js')
const { execute } = require('./ban')

module.exports = {
    name: 'unban',
    description: 'Remove o banimento de um usuario pelo ID. (admin)',

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('❌ Você não tem permissão para desbanir membros.')
        }

        const userId = args[0]
        if (!userId) {
            return message.reply('Por favor, forneça o ID do usuário para desbanir. Ex: `!unban 123456789`')
        }

        try {
            await message.guild.members.unban(userId)
            message.channel.send(`✅ O usuário com o ID **${userId}** foi desbanido.`)
        } catch (error) {
            message.reply('❌ Não encontrei esse banimento ou o ID é invalido.')
        }
    }
}