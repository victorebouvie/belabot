const { AttachmentBuilder } = require('discord.js')
const canvacord = require('canvacord')
const { getUserRankCard } = require('../utils/db')

module.exports = {
    name: 'rank',
    description: 'Mostra seu card de nível personalizado.',
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author

        const msgLoading = await message.reply('🎨 Estou pintando seu card... espera um pouquinho, tá? 🥺')

        try{
            const user = await getUserRankCard(target.id)

            const xp = user ? user.xp : 0
            const level = user ? user.level : 1
            const currentXp = xp
            const requiredXp = level * 100

            const bg = (user && user.preferences && user.preferences.bg) ? user.preferences.bg : null
            const color = (user && user.preferences && user.preferences.color) ? user.preferences.color : "#FF69B4"

            const rank = new canvacord.Rank()
                .setAvatar(target.displayAvatarURL({ extension: 'png', forceStatic: true }))
                .setCurrentXP(currentXp)
                .setRequiredXP(requiredXp)
                .setLevel(level)
                .setStatus(target.presence?.status || 'offline')
                .setProgressBar(color, "COLOR")
                .setUsername(target.username)
                .setRank(0, "", false)
                .setOverlay("#1c1c1c", 0.2)
                .setBackground("IMAGE", bg || "https://i.imgur.com/8Q9txf3.png")
                .renderEmojis(true)
            
            const data = await rank.build()
            const attachment = new AttachmentBuilder(data, { name: 'rank-card.png' })

            await msgLoading.delete()
            await message.channel.send({
                content: `Olha como você está ficando forte, **${target.username}**! ✨`,
                files: [attachment]
            })
        } catch (error) {
            console.error(error)
            await msgLoading.edit('Não consegui desenhar... acho que minha tinta acabou 😭')
        }
    }
}