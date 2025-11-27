const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Mostra a foto de perfil de um usuário.',
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;

        const avatarUrl = target.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle(`Avatar de ${target.username}`)
            .setImage(avatarUrl)
            .setFooter({ text: 'Lindo(a)!' });

        // Adiciona um botão/link para download
        message.channel.send({ 
            content: `🔗 Link direto: <${avatarUrl}>`,
            embeds: [embed] 
        });
    }
};