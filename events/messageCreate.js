const { Colors } = require('discord.js')
const { PREFIX } = require('../config')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.content.startsWith(PREFIX)) return

        const args = message.content.slice(PREFIX.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        //Verifica se o comando existe na coleção do cliente
        const command = client.commands.get(commandName)
        if (!command) return //Se não for um comando conhecido ignora

        try {
            await command.execute(message, args)

            const { getGuildConfig } = require('../utils/db')
            const config = getGuildConfig(message.guild.id)
            if (config.logChannel) {
                const logChannel = client.channels.cache.get(config.logChannel)
                if (logChannel) {
                    const embed = {
                        color: 0x0099ff,
                        title: '🤖 Comando Executado',
                        description: `**${message.author.tag}** usou: \`${message.content}\``,
                        timestamp: new Date(),
                        footer: { text: `Canal: ${message.channel.name}`}
                    }
                    logChannel.send({ embeds: [embed] }).catch(() => {})
                }
            }
        } catch(error) {
            console.error(error)
            message.reply('Houve um erro ao tentar executar esse comando!')
        }
    }
}