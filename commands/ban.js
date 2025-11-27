const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'Bane um membro do servidor permanentemente. (Admin)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('Ei... você não manda em mim assim... só gente importante pode 🥺 (Sem permissão)')
        }

        const member = message.mentions.members.first()
        const reason = args.slice(1).join(' ') || 'Porque ele era assustador...'

        if (!member) {
            return message.reply('Quem eu tenho que tirar? Me mostra... aponta pra ele 👉👈 (Mencione alguém)')
        }

        if (!member.bannable) {
            return message.reply('Aii, ele é muito forte! Não consigo... me protege? 😭 (O cargo dele é maior que o meu)')
        }

        try {
            await member.ban({ reason: reason })
            message.channel.send(`🚫 Tchauzinho **${member.user.tag}**... não volta mais tá? Ele me dava medo... 🥺💔 \n(Motivo: *${reason}*)`)
        } catch (error) {
            console.error(error)
            message.reply('Desculpa! Eu tentei mas deu erro... não fica bravo comigo? 😭')
        }
    }
}