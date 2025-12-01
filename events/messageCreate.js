const { Colors } = require('discord.js')
const { PREFIX, XP_PER_MESSAGE, XP_DIFFICULTY, XP_COOLDOWN } = require('../config')
const { getGuildConfig, addXpToUser } = require('../utils/db')

const cooldowns = new Set()

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return

        if (message.content.startsWith(PREFIX)) {
            const args = message.content.slice(PREFIX.length).trim().split(/ +/)
            const commandName = args.shift().toLowerCase()
            const command = client.commands.get(commandName)

            if (command) {
                try {
                    await command.execute(message, args)

                    const config = await getGuildConfig(message.guild.id)
                    if (config && config.logChannel) {
                        let logChannel = client.channels.cache.get(config.logChannel)
                        if (!logChannel) {
                            try {
                                logChannel = await client.channels.fetch(config.logChannel)
                            } catch (e) {
                                console.log('[DEBUG] Erro ao buscar canal de logs:', e.message)
                            }
                        }

                        if (logChannel) {
                            const embed = {
                                color: 0xFF69B4,
                                title: '🎀 Comando Executado',
                                description: `**${message.author.tag}** usou: \`${message.content}\``,
                                timestamp: new Date(),
                                footer: { text: `Canal: ${message.channel.name}` }
                            }
                            await logChannel.send({ embeds: [embed] }).catch(err => console.log('Erro ao enviar logs:', err))
                        }
                    }
                } catch (error) {
                    console.error('[ERRO FATAL]', error)
                    message.reply('Desculpa, eu fiz besteira... 😭')
                }
            }
            return
        }

        if (!cooldowns.has(message.author.id)) {
            try {
                const result = await addXpToUser(message.author, XP_PER_MESSAGE, XP_DIFFICULTY)

                if (result && result.levelUp) {
                    message.reply(`🥺 **${message.author.username}**, você subiu para o nível **${result.level}**! \nAgora você gosta mais de mim? 👉👈`)
                }
                cooldowns.add(message.author.id)
                setTimeout(() => {
                    cooldowns.delete(message.author.id)
                }, XP_COOLDOWN * 1000);
            } catch (err) {
                console.error("Erro ao adicionar XP:", err)
            }
        }
    }
}