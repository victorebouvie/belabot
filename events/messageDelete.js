const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js')
const { getGuildConfig } = require('../utils/db')

module.exports = {
    name: Events.MessageDelete,
    async execute(message, client) {
        if (!message.guild || message.author?.bot) return

        try {
            const config = await getGuildConfig(message.guild.id)

            if (!config || !config.logChannel) return
            const logChannel= client.channels.cache.get(config.logChannel)
            if (!logChannel) return

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🗑️ Vi o que você apagou hein... 👀')
                .setDescription('Tentou esconder, mas eu sou mais rápida!')
                .addFields(
                    { name: '👤 Quem apagou', value: `${message.author ? message.author.tag : 'Alguém misterioso (não estava no cache)'}`, inline: true},
                    { name: '📍 Onde', value: `${message.channel}`, inline: true},
                    { name: '📝 Conteúdo', value: message.content || '*[Era uma imagem ou algo que não consigo ler 😭]*'}
                )
                .setTimestamp()
                .setFooter({ text: `ID: ${message.author ? message.author.id : '?'}`})

            // Envia e avisa no console se der erro de permissão
            await logChannel.send({ embeds: [embed] })
        } catch (error) {
            console.error('Erro ao tentar logar mensagem deletada:', error)
        }
    }
}