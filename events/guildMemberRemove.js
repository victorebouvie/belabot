const { Events, EmbedBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/db');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        const config = await getGuildConfig(member.guild.id);
        
        if (!config || !config.logChannel) return;
        const logChannel = member.client.channels.cache.get(config.logChannel);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('💔 Me abandonou...')
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`**${member.user.tag}** saiu do servidor. \nEspero que não volte... (mentira, volta sim 😭)`)
            .setFooter({ text: `ID do traidor: ${member.id}` })
            .setTimestamp();

        logChannel.send({ embeds: [embed] }).catch(() => {});
    }
}