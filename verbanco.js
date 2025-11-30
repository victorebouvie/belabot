require('dotenv').config()
const mongoose = require('mongoose')
const Guild = require('./models/guild')

async function espiarMemoria() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("🕵️‍♀️ Conectado! Espiando o diário da Bela...\n")

        const configs = await Guild.find({})
        
        configs.forEach(conf => {
            console.log(`-----------------------------------`)
            console.log(`🏰 Servidor ID: ${conf.guildId}`)
            console.log(`📜 Canal de Log: ${conf.logChannel || 'Não definido'}`)
            console.log(`🔄 Obsessão Melby (Loop): ${conf.nicknameLoopActive ? 'LIGADO 🔥' : 'Desligado 💤'}`)
            console.log(`-----------------------------------\n`)
        })

        process.exit()
    } catch (error) {
        console.error(error)
    }
}

espiarMemoria()