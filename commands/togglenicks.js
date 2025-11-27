const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'togglenicks',
    description: 'Liga/Desliga minha obsessão por Melby.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Ei! Não toca nos meus botões! 😤')
        }

        const client = message.client

        client.nicknameLoopActive = !client.nicknameLoopActive

        const status = client.nicknameLoopActive ? 'ATIVADA ✨' : 'DESATIVADA 💔'
        const msg = client.nicknameLoopActive
            ? 'Oba! Vou transformar todo mundo em Melby pra sempre! 🥰'
            : 'Ah... tá bom. Parei de mexer nos nomes. 😒'

        message.reply(`A verificação automatica de apelidos foi **${status}**.`)
    }
}