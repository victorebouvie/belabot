const { PermissionsBitField } = require('discord.js')

module.exports = {
    name: 'delete',
    description: 'Apaga uma quantidade de mensagens do chat (Admin).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ Você não tem permissão para limpar mensagens.')
        }

        const amount = parseInt(args[0])
        if (isNaN(amount)) {
            return message.reply('Por favor, informe um número valido de mensagens para deletar. Ex: `!delete 30`')
        }

        if(amount < 1 || amount > 99) {
            return message.reply('Você precisa informar um numero entre 1 e 99. 💖')
        }

        try {
            const deleted = await message.channel.bulkDelete(amount + 1, true)

            const msg = await message.channel.send(`🧹 Limpei **${deleted.size - 1}** mensagens!`)

            setTimeout(() => {
                msg.delete().catch(() => {})
            }, 5000)
        } catch (error) {
            console.error(error)
            message.reply('Houve um erro ao tentar deletar as mensagens. Lembre-se que não posso deletar mensagens com mais de 14 dias.')
        }
    }
}