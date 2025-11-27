const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'delete',
    description: 'Limpa o chat (Sou organizada).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('Você não pode mandar eu limpar... só os admins... 🥺')
        }

        const amount = parseInt(args[0])
        if (isNaN(amount)) {
            return message.reply('Quantas mensagens? Me fala direito... 👉👈 Ex: `!delete 10`')
        }

        if(amount < 1 || amount > 99) {
            return message.reply('Escolhe um número entre 1 e 99... senão eu canso 🎀')
        }

        try {
            const deleted = await message.channel.bulkDelete(amount + 1, true)

            const msg = await message.channel.send(`🧹 Limpei **${deleted.size - 1}** sujeirinhas do chat! Sou muito organizada né? ✨`)

            setTimeout(() => {
                msg.delete().catch(() => {})
            }, 5000)
        } catch (error) {
            console.error(error)
            message.reply('Houve um erro ao tentar deletar as mensagens. Lembre-se que não posso deletar mensagens com mais de 14 dias.')
        }
    }
}