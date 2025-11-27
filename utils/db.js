const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, '../databa.json')

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}))
}

function getGuildConfig(guildId) {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    return data[guildId] || {}
}

function setLogChannel(guildId, channelId) {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

    if (!data[guildId]) data[guildId] = {}
    data[guildId].logChannel = channelId

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
}

module.exports = { getGuildConfig, setLogChannel }