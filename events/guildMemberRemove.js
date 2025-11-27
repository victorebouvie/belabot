const { Events, EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/db');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const config = getGuildConfig(member.guild.id);
        if (!config.logChannel) return;

        const logChannel = member.client.channels.cache.get(config.logChannel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('👋 Membro Saiu')
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`${member.user.tag} saiu do servidor.`)
            .setFooter({ text: `ID: ${member.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(() => {});
    }
};