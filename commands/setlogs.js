const { PermissionsBitField } = require('discord.js')
const { setLogChannel } = require('../utils/db')
const { execute } = require('./lock')

module.exports = {
    name: 'setlogs',
    description: 'Define o canal onde logs serão enviadas. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Apenas administradores podem configurar os logs.')
        }

        const channel = message.mentions.channels.first()

        if (!channel) {
            return message.reply('⚠️ Por favor, mencione um canal de texto. Ex: `!setlogs #logs`')
        }

        setLogChannel(message.guild.id, channel.id)

        message.reply(`✅ Configurado! Agora enviarei os relatórios no canal ${channel}.`)
    }
}