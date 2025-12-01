const mongoose = require('mongoose')

const userLevelSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String },
    avatarUrl: { type: String },

    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    lastXpTime: { type: Date, default: Date.now },

    preferences: {
        bg: { type: String, default: '' },
        color: { type: String, default: '#FF69B4' }
    }
})

module.exports = mongoose.model('userLevel', userLevelSchema)