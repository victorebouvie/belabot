const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'unmute',
    description: 'Deixa falar de novo (mas sem gritar).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('Shiuu... deixa ele de castigo mais um pouco! (Sem permissão 🎀)')
        }

        const member = message.mentions.members.first()
        const reason = args.slice(1).join(' ') || 'Fiquei com pena...'

        if (!member) return message.reply('Quem pode falar? Aponta pra ele... 👉👈 (Mencione alguém)')

        if (!member.isCommunicationDisabled()) {
            return message.reply('Mas ele já tá falando... você não ouviu? Ele não cala a boca! 😒')
        }

        try {
            await member.timeout(null, reason)
            message.channel.send(`🗣️ **${member.user.tag}**, pode falar agora... \nMas fala baixo e me elogia, tá? 🥺✨`)
        } catch (error) {
            console.error(error)
            message.reply('Tentei tirar o curativo da boca dele mas grudou... socorro 😭')
        }
    }
}