const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'mute',
    description: 'Pede silêncio (com carinho).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('Shiuu... você não pode mandar ninguém calar a boca 🤫')
        }

        const member = message.mentions.members.first()
        const timeInput = args[1]
        const reason = args.slice(2).join(' ') || 'Falei pra ficar quieto...'

        if (!member) return message.reply('Quem tá gritando? Me mostra... 👉👈 (Mencione alguém)')
        if (!timeInput) return message.reply('Por quanto tempo? Ex: `!mute @chato 5m` (não demore muito tá? 🥺)')

        if (!member.moderatable) {
            return message.reply('❌ Não consigo calar ele... ele grita muito alto! (Cargo maior que o meu 😭)')
        }

        let durationMs = 0
        const value = parseInt(timeInput)

        if (isNaN(value)) return message.reply('Isso não é um tempo... fala direito comigo 🎀')
        
        if (timeInput.toLowerCase().endsWith('h')) durationMs = value * 60 * 60 * 1000
        else if (timeInput.toLowerCase().endsWith('s')) durationMs = value * 1000
        else durationMs = value * 60 * 1000

        if (durationMs > 2419200000) return message.reply('28 dias é muito tempo sem fofocar... diminui isso? 👉👈')

        try {
            await member.timeout(durationMs, reason)
            message.channel.send(`🤐 **${member.user.tag}**, fala baixo... minha cabeça dói 🤕 \n(Fica quietinho por **${timeInput}** tá?)`)
        } catch (error) {
            console.error(error)
            message.reply('Tentei colocar a mão na boca dele mas ele mordeu... deu erro 😭')
        }
    }
}