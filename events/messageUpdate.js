const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.MessageUpdate,
    async execute(oldMessage, newMessage, client) {
        if (oldMessage.author?.bot) return
        if (oldMessage.content === newMessage.content) return

        const config = await getGuildConfig(oldMessage.guild.id)
        
        if (!config || !config.logChannel) return
        const logChannel = client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const embed = new EmbedBuilder()
            .setColor('#ffa500')
            .setTitle('✏️ Mudou o que disse por quê?')
            .setDescription(`**${oldMessage.author}** editou uma mensagem... suspeito 👀\n**Canal:** ${oldMessage.channel}`)
            .addFields(
                { name: '❌ Antes', value: oldMessage.content || '*[Nada]*', inline: false},
                { name: '✨ Depois', value: newMessage.content || '*[Nada]*', inline: false},
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMessage.id}` })

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}