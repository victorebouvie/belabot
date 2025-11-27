const { PermissionsBitField } = require('discord.js')
const { changeNicknames } = require('../utils/nicknameManager')

module.exports = {
    name: 'melbyall',
    description: 'Deixa todo mundo com nome bonito (Melby) ✨.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Sai... você não entende de beleza! (Sem permissão) 🎀')
        }
        message.reply('Ai, vou ver quem tá com nome feio aqui e arrumar... **Melby** é tão mais *aesthetic* ne? ✨💁‍♀️')

        await changeNicknames (message.guild)

        message.channel.send('Prontinho! Agora todo mundo é **Melby** (ou quase). Ficaram lindos! 💖')
    }
}