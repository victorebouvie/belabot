const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'unlock',
    description: 'Destranca o canal atual. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('❌ Você não tem permissão para gerenciar canais.')
        }

        const channel = message.channel
        
        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: null
            })
            message.channel.send('🔓 **Canal destrancado!** Podem voltar a falar.')
        } catch (error) {
            console.error(error)
            message.reply('Erro ao tentar destrancar o canal.')
        }
    }
}