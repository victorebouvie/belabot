const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Mostra a foto de perfil de um usuário.',
    async execute(message, args) {
        const target = message.mentions.users.first() || message.author;

        const avatarUrl = target.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle(`🎀 Olha que coisinha linda...`)
            .setDescription(`Aqui está a foto de **${target.username}**!`)
            .setImage(avatarUrl)
            .setFooter({ text: 'Mas eu sou mais fofinha, né? 👉👈' });

        // Adiciona um botão/link para download
        message.channel.send({ 
            content: `Peguei a foto pra você! (Deu trabalho tá? 🥺)\n🔗 Link: <${avatarUrl}>`,
            embeds: [embed] 
        })
    }
}