const Guild = require('../models/guild')
const UserLevel = require('../models/userLevel')

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

async function addXpToUser(user, amount, difficulty) {
    try {
        let userData = await UserLevel.findOne({ userId: user.id })

        if (!userData) {
            userData = await UserLevel.create({
                userId: user.id,
                username: user.username,
                avatarUrl: user.displayAvatarURL({ extension: 'png' }),
                xp: amount,
                level: 1,
                lastXpTime: new Date()
            })
            return { levelUp: false, level: 1 }
        }

        userData.username = user.username
        userData.avatarUrl = user.displayAvatarURL({ extension: 'png' })

        userData.xp += amount
        userData.lastXpTime = new Date()

        const xpNeeded = userData.level * difficulty
        let levelUp = false

        if (userData.xp >= xpNeeded) {
            userData.level++
            userData.xp -= xpNeeded
            levelUp = true
        }

        await userData.save()
        return { levelUp, level: userData.level }
    } catch (error) {
        console.error('Erro ao dar xp', error)
        return null
    }
}

async function getUserRankCard(userId) {
    try {
        return await UserLevel.findOne({ userId })
    } catch (error) {
        return []
    }
}

async function getLeaderboard(limit = 10) {
    try {
        return await UserLevel.find().sort({ level: -1, xp: -1 }).limit(limit)
    } catch (error) {
        return []
    }
}

async function updateUserPreferences(userId, prefs) {
    try {
        await UserLevel.findOneAndUpdate(
            { userId: userId },
            { preferences: prefs },
            { upsert: true }
        )
        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

module.exports = {
    getGuildConfig,
    setLogChannel,
    setNicknameLoop,
    addXpToUser,
    getUserRankCard,
    getLeaderboard,
    updateUserPreferences, 
}