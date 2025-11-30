const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        const guildId = newState.guild.id || oldState.guild.id
        
        const config = await getGuildConfig(guildId)

        if (!config || !config.logChannel) return

        const logChannel = client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const member = newState.member || oldState.member
        const embed = new EmbedBuilder().setTimestamp()

        if (!oldState.channelId && newState.channelId) {
            embed.setColor('#00FF00')
                .setTitle('🔊 Entrou na Call')
                .setDescription(`**${member.user.tag}** entrou em **${newState.channel.name}**.\n(Posso ir junto? 👉👈)`)
        }
        else if (oldState.channelId && !newState.channelId) {
            embed.setColor('#FF0000')
                .setTitle('🔇 Saiu da Call')
                .setDescription(`**${member.user.tag}** saiu de **${oldState.channel.name}**.\n(O silêncio voltou... 🥺)`)
        }
        else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            embed.setColor('#FFFF00')
                .setTitle('🔄 Trocou de Sala')
                .setDescription(`**${member.user.tag}** foi de **${oldState.channel.name}** para **${newState.channel.name}**.`)
        } else {
            return; 
        }

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}