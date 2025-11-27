const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Calma... vamos devagar (Modo Lento).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('Ei, não mexe nisso... deixa eles falarem! 🥺');
        }

        let time = args[0];

        if (time === undefined) {
            return message.reply('Quanto tempo eu espero? Me fala... 👉👈 (Use 0 para desligar)');
        }

        time = parseInt(time);
        if (isNaN(time)) return message.reply('Números, amor... usa números. 🎀');
        if (time < 0 || time > 21600) return message.reply('Isso é tempo demais... eu vou dormir desse jeito 😴');

        try {
            await message.channel.setRateLimitPerUser(time);
            if (time === 0) {
                message.channel.send('🐇 **Podem falar rápido!** (Mas não gritem comigo tá? 🥺)');
            } else {
                message.channel.send(`🐢 **Vamos com calma...** vocês falam muito rápido, fico tonta! \n(Uma mensagem a cada **${time}s**)`);
            }
        } catch (error) {
            console.error(error);
            message.reply('Não consegui mexer no relógio... quebrou? 😭');
        }
    }
};