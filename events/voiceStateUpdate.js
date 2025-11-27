const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState, client) {
        const guildId = newState.guild.id || oldState.guild.id
        const config = getGuildConfig(guildId)

        if (!config.logChannel) return

        const logChannel = client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const member = newState.member || oldState.member
        const embed = new EmbedBuilder().setTimestamp()

        // CASO 1: Entrou na call
        if (!oldState.channelId && newState.channelId) {
            embed.setColor('#00FF00') // Verde
                .setTitle('🔊 Entrou em Call')
                .setDescription(`**${member.user.tag}** entrou no canal **${newState.channel.name}**`);
        }
        // CASO 2: Saiu da call
        else if (oldState.channelId && !newState.channelId) {
            embed.setColor('#FF0000') // Vermelho
                .setTitle('🔇 Saiu da Call')
                .setDescription(`**${member.user.tag}** saiu do canal **${oldState.channel.name}**`);
        }
        // CASO 3: Trocou de call
        else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            embed.setColor('#FFFF00') // Amarelo
                .setTitle('🔄 Trocou de Call')
                .setDescription(`**${member.user.tag}** foi de **${oldState.channel.name}** para **${newState.channel.name}**`);
        } else {
            return; // Mudou apenas status (mute/video), ignorar por enquanto
        }

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}