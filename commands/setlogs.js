const { PermissionsBitField } = require('discord.js')
const { setLogChannel } = require('../utils/db')
const { execute } = require('./lock')

module.exports = {
    name: 'setlogs',
    description: 'Escolhe onde vou fofocar (Logs).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Isso é coisa de admin... sai daqui curioso! 🎀')
        }

        const channel = message.mentions.channels.first()

        if (!channel) {
            return message.reply('Onde eu escrevo? Aponta pra mim... 👉👈 Ex: `!setlogs #fofocas`')
        }

        setLogChannel(message.guild.id, channel.id)

        message.reply(`✅ Amei! Vou contar **TUDO** que acontecer lá no ${channel}. Sou a melhor vigia né? ✨`)
    }
}