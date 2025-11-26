const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js')
const { LOG_CHANNEL_ID } = require('../config')

module.exports = {
    name: Events.MessageDelete,
    async execute(message, client) {
        if (message.author?.bot) return
        if (!LOG_CHANNEL_ID) return

        const logChannel = client.channels.cache.get(LOG_CHANNEL_ID)
        if (!logChannel) return console.log('Canal de Logs não encontrado.')

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🗑️ Mensagem Apagada')
            .addFields(
                { name: 'Autor', value: `${message.author ? message.author.tag : 'Desconhecido'}`, inline: true},
                { name: 'Canal', value: `${message.channel}`, inline: true},
                { name: 'Conteúdo', value: message.content || '*[Imagem ou Embed]*'}
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${message.author ? message.author.id : '?'}`})

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}