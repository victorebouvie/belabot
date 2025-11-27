const { EmbedBuilder } = require('discord.js')
const { PREFIX } = require('../config')

const ADM_COMMANDS = [
    'ban', 'unban', 'kick', 'mute', 'unmute',
    'lock', 'unlock', 'delete', 'slowmode',
    'setlogs', 'say', 'melbyall', 'resetnicks', 'togglenicks'
]

module.exports = {
    name: 'help',
    description: 'Mostra tudo que sei fazer pra te agradar.',
    async execute(message, args) {
        const { commands } = message.client

        const admList = []
        const geralList = []

        commands.forEach(cmd => {
            const line = `\`${PREFIX}${cmd.name}\` - *${cmd.description || 'Sem descrição...'}*`

            if (ADM_COMMANDS.includes(cmd.name)) {
                admList.push(line)
            } else {
                geralList.push(line)
            }
        })

        admList.sort()
        geralList.sort()

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('📖 O que eu sei fazer...')
            .setDescription(`Arrumei minha bolsa e separei tudo por categoria pra você não brigar comigo... 👉👈`)
            .setThumbnail(message.client.user.displayAvatarURL())
            .addFields(
                { 
                    name: '👑 Só pra quem manda em mim (Admin)', 
                    value: admList.length > 0 ? admList.join('\n') : 'Não sei fazer nada perigoso... 🥺', 
                    inline: false 
                },
                { 
                    name: '🎀 Pra gente se divertir (Geral)', 
                    value: geralList.length > 0 ? geralList.join('\n') : 'Não sei brincar... 💔', 
                    inline: false 
                }
            )
            .setTimestamp()
            .setFooter({ text: `Espero que tenha gostado, ${message.author.username} ✨`, iconURL: message.author.displayAvatarURL() })

        message.channel.send({ embeds: [embed] })
    }
}