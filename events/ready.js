const { Events } = require('discord.js')
const { GUILD_ID, CHECK_INTERVAL } = require('../config')
const { changeNicknames } = require('../utils/nicknameManager')

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Bot ${client.user.tag} está online!`)

        client.nicknameLoopActive = false

        // Loop automatico de verificação
        setInterval(async () => {
            if (!client.nicknameLoopActive) return

            const guild = await client.guilds.fetch(GUILD_ID).catch(() => null)
            if (guild) {
                console.log('Executando verificação automática...')
                changeNicknames(guild)
            }
        }, CHECK_INTERVAL)
    }
}