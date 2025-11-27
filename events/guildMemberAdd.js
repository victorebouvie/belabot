const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const config = getGuildConfig(member.guild.id)
        if (!config.logChannel) return

        const logChannel = member.client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const createdAt = Math.floor(member.user.createdTimestamp / 1000)

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('👋 Novo Membro')
            .setThumbnail (member.user.displayAvatarURL())
            .setDescription(`${member} entrou no servidor.`)
            .addFields(
                { name: 'Tag', value: member.user.tag, inline: true},
                { name: 'ID', value: member.id, inline: true},
                { name: 'Conta Criada', value: `<t:${createdAt}:R>`, inline: false },
            )
            .setTimestamp()

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}