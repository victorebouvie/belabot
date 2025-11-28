const { PermissionsBitField } = require('discord.js')
const { getGuildConfig, setNicknameLoop } = require('../utils/db')

module.exports = {
    name: 'togglenicks',
    description: 'Liga/Desliga minha obsessão por Melby.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('Ei! Não toca nos meus botões! 😤')
        }

        const guildId = message.guild.id
        const config = await getGuildConfig(guildId)
        const currentStatus = config ? config.nicknameLoopActive : false
        const newStatus = !currentStatus
        const success = await setNicknameLoop(guildId, newStatus)

        if (!success) {
            return message.reply('Minha cabeça doeu... não consegui salvar essa configuração no banco. Desculpa 😭')
        }

        message.client.nicknameLoopActive = newStatus

        const status = newStatus ? 'ATIVADA ✨' : 'DESATIVADA 💔'
        const msg = newStatus
            ? 'Oba! Vou transformar todo mundo em Melby pra sempre! 🥰'
            : 'Ah... tá bom. Parei de mexer nos nomes. 😒'

        message.reply(`A verificação automática foi **${status}**. \n${msg}`)
    }
}