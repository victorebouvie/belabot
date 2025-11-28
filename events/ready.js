const { Events } = require('discord.js')
const { GUILD_ID, CHECK_INTERVAL } = require('../config')
const { changeNicknames } = require('../utils/nicknameManager')
const { getGuildConfig } = require('../utils/db') // Importar DB

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✨ Bot ${client.user.tag} acordou e tá linda!`)

        const config = await getGuildConfig(GUILD_ID)
        
        if (config && config.nicknameLoopActive) {
            client.nicknameLoopActive = true
            console.log('🔄 Memória recuperada: O Loop de Nicks estava ATIVO. Voltando a trabalhar...')
        } else {
            client.nicknameLoopActive = false
            console.log('💤 O Loop de Nicks está desligado.')
        }
        // --------------------------------

        // Loop automatico
        setInterval(async () => {
            if (!client.nicknameLoopActive) return

            const guild = await client.guilds.fetch(GUILD_ID).catch(() => null)
            if (guild) {
                // console.log('Executando verificação automática...') // Comentei pra não flodar o console
                changeNicknames(guild)
            }
        }, CHECK_INTERVAL)
    }
}