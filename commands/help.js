const { EmbedBuilder } = require('discord.js')
const { PREFIX } = require('../config')

module.exports = {
    name: 'help',
    description: 'Mostra a lista de todos os comandos disponiveis.',
    async execute(message, args) {
        const { commands } = message.client

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('📖 Ajuda da Bela')
            .setDescription(`Aqui estão meus comandos. Use **${PREFIX}** antes de cada um!`)
            .setThumbnail(message.client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })

        commands.forEach(cmd => {
            const desc = cmd.description || 'Sem descrição definida'

            embed.addFields({
                name: `🔷${PREFIX}${cmd.name}`,
                value: `*${desc}`,
                inline: false
            })
        })

        message.channel.send({ embeds: [embed] })
    }
}