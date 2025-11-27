const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Mostra informações sobre um usuário.',
    async execute(message, args) {
        // Pega quem foi mencionado OU o autor da mensagem
        const target = message.mentions.members.first() || message.member;
        const user = target.user;

        const joinedAt = Math.floor(target.joinedTimestamp / 1000);
        const createdAt = Math.floor(user.createdTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setColor(target.displayHexColor)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTitle(`Informações de ${user.username}`)
            .addFields(
                { name: '🆔 ID', value: user.id, inline: true },
                { name: '🏷️ Tag', value: user.tag, inline: true },
                { name: '📅 Criado em', value: `<t:${createdAt}:F> (<t:${createdAt}:R>)`, inline: false },
                { name: '📥 Entrou em', value: `<t:${joinedAt}:F> (<t:${joinedAt}:R>)`, inline: false },
                { name: '🤖 Bot?', value: user.bot ? 'Sim' : 'Não', inline: true }
            )
            .setFooter({ text: `Solicitado por ${message.author.username}` });

        message.channel.send({ embeds: [embed] });
    }
};