require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const mongoose = require('mongoose')

const express = require('express')
const cors = require('cors')
const { API_PORT, XP_DIFFICULTY } = require('./config')
const { getLeaderboard, getUserRankCard, updateUserPreferences } = require('./utils/db')

// Configuração do Cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
    ]
})

const mongoURL = process.env.MONGO_URL
if (!mongoURL) {
    console.error('não tem o link do banco de dados😭 cade ele no .env?')
    process.exit(1)
}

mongoose.connect(mongoURL)
    .then(() => console.log('Conectada ao mongo db! minha memoria esta perfeita'))
    .catch((err) => console.error("não consegui conectar no banco"))

//Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
    } else {
        console.log(`[AVISO] O comando em ${filePath} está faltando 'name' ou 'execute'.`)
    }
}

//Event Handler
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client))
    } else {
        client.on(event.name, (...args) => event.execute(...args, client))
    }
}

// Api express
const app = express()
app.use(cors())
app.use(express.json())

// Rota 1
app.get('/api/leaderboard', async (req, res) => {
    const data = await getLeaderboard(10)
    const formatted = data.map(u => ({
        username: u.username,
        xp: u.xp,
        lvl: u.level,
        avatar: u.avatarUrl || 'https://i.imgur.com/AobuOcq.jpeg'
    }))
    res.json(formatted)
})

// Rota 2
app.get('/api/user/:id', async (req, res) => {
    const user = await getUserRankCard(req.params.id)
    if (!user) return res.status(404).json({ error: "Usuario não encontrado" })

    const allUsers = await getLeaderboard(100)
    const rankPos = allUsers.findIndex(u => u.userId === req.params.id) + 1

    res.json({
        username: user.username,
        avatar: user.avatarUrl,
        xp: user.xp,
        maxXp: user.level * XP_DIFFICULTY,
        level: user.level,
        rank: rankPos || 999,
        preferences: user.preferences
    })
})

// Rota 3
app.post('/api/user/:id/card', async (req, res) => {
    const { bg, color } = req.body
    const success = await updateUserPreferences(req.params.id, { bg, color })

    if (success) res.json({ message: "Guardei com carinho 🎀" })
    else res.status(500).json({ error: "Não consegui salvar" })
})

// Inicia a api
app.listen(API_PORT, () => {
    console.log(`Painel da bela rodando na porta ${API_PORT}`)
})

// Login
client.login(process.env.DISCORD_TOKEN)