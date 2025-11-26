const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'togglenicks',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Você não tem permissão pra alterar configuração do bot.')
        }

        const client = message.client

        client.nicknameLoopActive = !client.nicknameLoopActive

        const status = client.nicknameLoopActive ? 'ATIVADA' : 'DESATIVADA'

        message.reply(`A verificação automatica de apelidos foi **${status}**.`)
    }
}