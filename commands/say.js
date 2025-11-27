const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Faz a Bela falar uma mensagem (Admin).',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply('❌ Sem permissão.');
        }

        const text = args.join(' ');
        if (!text) return message.reply('O que você quer que eu diga?');

        try {
            await message.delete();
        } catch (err) {
            // Se não der pra apagar, tudo bem
        }

        message.channel.send(text);
    }
};