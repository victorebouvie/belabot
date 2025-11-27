const { EmbedBuilder } = require('discord.js')
const { PREFIX } = require('../config')

module.exports = {
    name: 'help',
    description: 'Mostra tudo que sei fazer pra te agradar.',
    async execute(message, args) {
        const { commands } = message.client

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('📖 Diário da Bela')
            .setDescription(`Olha tudo que eu aprendi fazer por você... espero que goste 👉👈 \nUse **${PREFIX}** antes, tá?`)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: `Faço tudo pelo(a) ${message.author.username} 🎀`, iconURL: message.author.displayAvatarURL() })

        commands.forEach(cmd => {
            const desc = cmd.description || 'Segredinho...'

            embed.addFields({
                name: `✨${PREFIX}${cmd.name}`,
                value: `*${desc}*`,
                inline: false
            })
        })

        message.channel.send({ embeds: [embed] })
    }
}