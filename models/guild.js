const mongoose = require('mongoose')

const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    logChannel: { type: String, default: null },
    nicknameLoopActive: { type: Boolean, default: false }
})

module.exports = mongoose.model('Guild', guildSchema)