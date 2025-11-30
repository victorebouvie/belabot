require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const mongoose = require('mongoose')

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

// Login
client.login(process.env.DISCORD_TOKEN)