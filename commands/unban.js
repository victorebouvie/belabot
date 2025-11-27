const { PermissionsBitField } = require('discord.js')
const { execute } = require('./ban')

module.exports = {
    name: 'unban',
    description: 'Dei uma segunda chance... (Sou um anjo 😇).',

    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('Você não manda em quem entra ou sai... só os admins 🥺')
        }

        const userId = args[0]
        if (!userId) {
            return message.reply('Quem eu tenho que perdoar? Me dá o ID dele... 👉👈 Ex: `!unban 123456`')
        }

        try {
            await message.guild.members.unban(userId)
            message.channel.send(`✅ O coração da Bela é muito mole... desbani o ID **${userId}**. \nEspero que ele seja bonzinho agora 🎀`)
        } catch (error) {
            message.reply('Procurei esse ID na minha lista negra e não achei... ou ele não existe ou eu perdi o papelzinho 😭')
        }
    }
}