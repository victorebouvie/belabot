const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Eu falo por você (mas tenho vergonha 👉👈).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('Não vou falar nada pra você! 😤');
        }

        const text = args.join(' ');
        if (!text) return message.reply('Fala no meu ouvido o que é pra eu dizer... 👉👈 (Digite a mensagem)');

        try {
            await message.delete();
        } catch (err) {
            // Se não der pra apagar, tudo bem
        }

        message.channel.send(text);
    }
};