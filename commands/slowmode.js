const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Define o modo lento do canal atual.',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply('❌ Sem permissão.');
        }

        let time = args[0];

        if (time === undefined) {
            return message.reply('⚠️ Informe o tempo em segundos. Use 0 para desligar. Ex: `!slowmode 5`');
        }

        time = parseInt(time);
        if (isNaN(time)) return message.reply('⚠️ Por favor, use apenas números.');
        if (time < 0 || time > 21600) return message.reply('⚠️ O tempo deve ser entre 0 e 21600 segundos (6 horas).');

        try {
            await message.channel.setRateLimitPerUser(time);
            if (time === 0) {
                message.channel.send('🐇 **Modo lento desativado!** O chat está voando!');
            } else {
                message.channel.send(`🐢 **Modo lento ativado!** Uma mensagem a cada **${time} segundos**.`);
            }
        } catch (error) {
            console.error(error);
            message.reply('Erro ao configurar o modo lento.');
        }
    }
};