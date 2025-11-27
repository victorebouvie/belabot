const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.nickname === newMember.nickname) return

        const config = getGuildConfig(newMember.guild.id)
        if (!config.logChannel) return

        const logChannel = newMember.client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const oldNick = oldMember.nickname || oldMember.user.username
        const newNick = newMember.nickname || newMember.user.username

        const embed = new EmbedBuilder()
            .setColor('#0000FF')
            .setTitle('🏷️ Apelido alterado')
            .setDescription(`**${newMember.user.tag}** mudou de apelido.`)
            .addFields(
                { name: 'Antigo', value: `\`${oldNick}\``, inline: true},
                { name: 'Novo', value: `\`${newNick}\``, inline: true}
            )
            .setTimestamp()

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}