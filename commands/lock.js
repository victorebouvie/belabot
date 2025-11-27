const { PermissionsBitField } = require('discord.js')
module.exports = {
    name: 'lock',
    description: 'Tranca o canal (tava muito barulho 🥺).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('Você não pode trancar... deixa a porta aberta! 🥺')
        }

        const channel = message.channel

        try {
            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                [PermissionsBitField.Flags.SendMessages]: false
            })
            message.channel.send('🔒 **Tranquei a porta!** Ninguém fala mais nada... tava muito barulho e eu fiquei assustada 🥺')
        } catch (error) {
            console.error(error)
            message.reply('A porta tá emperrada... não consigo trancar! Me ajuda? 😭')
        }
    }
}