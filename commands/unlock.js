const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'unlock',
    description: 'Destranca o canal (tava muito quieto 💔).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('Não mexe na porta! Deixa trancado se eu quiser! 😤')
        }

        const channel = message.channel
        
        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: null
            })
            message.channel.send('🔓 **Abri a porta!** \nPodem falar... estava me sentindo muito sozinha nesse silêncio 🥺')
        } catch (error) {
            console.error(error)
            message.reply('A chave quebrou na fechadura... não consigo abrir! 😭')
        }
    }
}