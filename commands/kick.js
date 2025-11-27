const { PermissionsBitField } = require('discord.js')
const { description, execute } = require('./togglenicks')

module.exports = {
    name: 'kick',
    description: 'Expulsa alguém (mas com carinho).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('Ei... você tem permissão pra isso. Não briga comigo 🥺')
        }

        const member = message.mentions.members.first()
        const reason = args.slice(1).join(' ') || 'Sem motivo... só vontade 👉👈'

        if (!member) {
            return message.reply('Menciona quem você quer chutar... eu não adivinho 😭')
        }

        if (!member.kickable) {
            return message.reply('Ele é muito pesado! Não consigo empurrar... 😭 (Cargo dele é maior)')
        }

        try {
            await member.kick(reason)
            message.channel.send(`👞 Chutei o **${member.user.tag}** (mas chutei fofo tá? 🎀). \nMotivo: *${reason}*`)
        } catch (error) {
            console.error(error)
            message.reply('Tentei chutar mas tropecei... deu erro 😭')
        }
    }
}