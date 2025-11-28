const Guild = require('../models/guild')

async function getGuildConfig(guildId) {
    try {
        let config = await Guild.findOne({ guildId: guildId })
        if (!config) {
            config = await Guild.create({ guildId: guildId })
        }
        return config
    } catch (error) {
        console.error(error)
        return null
    }
}

async function setLogChannel(guildId, channelId) {
    try {
        await Guild.findOneAndUpdate(
            { guildId: guildId },
            { logChannel: channelId },
            { upsert: true, new: true }
        )
        return true
    } catch(error) {
        console.error(error)
        return false
    }
}

async function setNicknameLoop(guildId, status) {
    try {
        await Guild.findOneAndUpdate(
            { guildId: guildId },
            { nicknameLoopActive: status },
            { upsert: true, new: true }
        )
        return true
    } catch(error) {
        console.error(error)
        return false
    }
}

module.exports = { getGuildConfig, setLogChannel, setNicknameLoop }