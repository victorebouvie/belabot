const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const config = await getGuildConfig(member.guild.id)
        
        if (!config || !config.logChannel) return
        const logChannel = member.client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const createdAt = Math.floor(member.user.createdTimestamp / 1000)

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('👀 Olha quem chegou...')
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`**${member}** entrou. Será que vai gostar de mim? 👉👈`)
            .addFields(
                { name: '🏷️ Nome', value: member.user.tag, inline: true},
                { name: '🆔 ID', value: member.id, inline: true},
                { name: '📅 Conta criada', value: `<t:${createdAt}:R>`, inline: false },
            )
            .setFooter({ text: 'Já tô de olho nele(a)...' })
            .setTimestamp()

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}