const { PermissionsBitField } = require('discord.js')
const { changeNicknames } = require('../utils/nicknameManager')

module.exports = {
    name: 'melbyall',
    description: 'Transforma todo mundo em Melby(s) (Admin).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('❌ Você não tem permissão pra usar esse comando.')
        }
        message.reply('Estou verificando quem é a vadia que não é Melby...')

        await changeNicknames (message.guild)

        message.channel.send('Verificação concluida!')
    }
}