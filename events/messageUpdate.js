const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage, client) {
        if (oldMessage.author?.bot) return

        if (oldMessage.content === newMessage) return

        const config = getGuildConfig(oldMessage.guild.id)
        if (!config.logChannel) return

        const logChannel = client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle('✏️ Mensagem Editada')
            .setDescription(`**Autor:** ${oldMessage.author}\n**Canal:** ${oldMessage.channel}`)
            .addFields(
                { name: 'Antiga', value: oldMessage.content || '*Sem conteúdo*', inline: false},
                { name: 'Nova', value: newMessage.content || '*Sem conteúdo*', inline: false},
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMessage.id}` })

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}