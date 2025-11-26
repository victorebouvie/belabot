const { PermissionsBitField } = require('discord.js')
module.exports = {
    name: 'lock',
    description: 'Tranca o canal atual impedindo mensagens. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('❌ Você não tem permissão para gerenciar canais.')
        }

        const channel = message.channel

        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                sendMessage: false
            })
            message.channel.send('🔒 **Canal trancado!** Ninguém pode falar aqui até que seja destrancado.')
        } catch (error) {
            console.error(error)
            message.reply('Erro ao tentar trancar o canal.')
        }
    }
}