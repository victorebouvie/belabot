const { Colors } = require('discord.js')
const { PREFIX } = require('../config')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.content.startsWith(PREFIX)) return

        const args = message.content.slice(PREFIX.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()

        const command = client.commands.get(commandName)
        if (!command) return 

        try {
            await command.execute(message, args)

            console.log(`[DEBUG] Tentando logar comando: ${commandName}`)
            
            const config = await getGuildConfig(message.guild.id)
            if (!config) return console.log('[DEBUG] ❌ Nenhuma config encontrada no banco para este servidor.')
            
            if (!config.logChannel) return console.log('[DEBUG] ❌ Config encontrada, mas campo logChannel é null.')

            console.log(`[DEBUG] Canal salvo no banco: ${config.logChannel}`)

            let logChannel = client.channels.cache.get(config.logChannel)
            if (!logChannel) {
                console.log('[DEBUG] Canal não estava no cache. Tentando fetch...')
                try {
                    logChannel = await client.channels.fetch(config.logChannel)
                } catch (e) {
                    console.log('[DEBUG] ❌ Erro ao buscar canal (Fetch):', e.message)
                    return
                }
            }

            if (logChannel) {
                const embed = {
                    color: 0xFF69B4,
                    title: '🎀 Comando Executado',
                    description: `**${message.author.tag}** usou: \`${message.content}\``,
                    timestamp: new Date(),
                    footer: { text: `Canal: ${message.channel.name}`}
                }
                
                await logChannel.send({ embeds: [embed] })
                console.log('[DEBUG] ✅ Log enviado com sucesso!')
            } else {
                console.log('[DEBUG] ❌ Canal existe no banco mas o bot não consegue ver (Permissão?).')
            }

        } catch(error) {
            console.error('[ERRO FATAL]', error)
            message.reply('Houve um erro ao tentar executar esse comando!')
        }
    }
}