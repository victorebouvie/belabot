const { Events, EmbedBuilder } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (oldMember.nickname === newMember.nickname) return

        const config = await getGuildConfig(newMember.guild.id)
        
        if (!config || !config.logChannel) return
        const logChannel = newMember.client.channels.cache.get(config.logChannel)
        if (!logChannel) return

        const oldNick = oldMember.nickname || oldMember.user.username
        const newNick = newMember.nickname || newMember.user.username

        const embed = new EmbedBuilder()
            .setColor('#0000FF')
            .setTitle('💅 Mudança de Visual (Nick)')
            .setDescription(`**${newMember.user.tag}** trocou de nome. O que achou?`)
            .addFields(
                { name: '❌ Antes era', value: `\`${oldNick}\``, inline: true},
                { name: '✨ Agora é', value: `\`${newNick}\``, inline: true}
            )
            .setTimestamp()

        logChannel.send({ embeds: [embed] }).catch(() => {})
    }
}