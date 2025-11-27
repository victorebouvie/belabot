const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Stalking básico (sei tudo sobre você 👀).',
    async execute(message, args) {
        // Pega quem foi mencionado OU o autor da mensagem
        const target = message.mentions.members.first() || message.member;
        const user = target.user;

        const joinedAt = Math.floor(target.joinedTimestamp / 1000);
        const createdAt = Math.floor(user.createdTimestamp / 1000);

        const embed = new EmbedBuilder()
            .setColor('#FF69B4') // Rosa Bela
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTitle(`📂 Dossiê Secreto: ${user.username}`)
            .setDescription('Olha o que eu descobri fuçando suas coisas... 👉👈')
            .addFields(
                { name: '🆔 Identidade', value: `\`${user.id}\``, inline: true },
                { name: '🏷️ Como chamam', value: `\`${user.tag}\``, inline: true },
                { name: '📅 Nasceu em', value: `<t:${createdAt}:F> \n(<t:${createdAt}:R>)`, inline: false },
                { name: '🏠 Entrou na minha vida (server)', value: `<t:${joinedAt}:F> \n(<t:${joinedAt}:R>)`, inline: false },
                { name: '🤖 É robô igual eu?', value: user.bot ? 'Sim, somos parentes! 🤖' : 'Não, é humano (eca) 💅', inline: true }
            )
            .setFooter({ text: `Pesquisei tudo isso só pra você, ${message.author.username} 💖` });

            message.channel.send({ 
            content: `Aqui está tudo sobre o(a) **${user.username}**! (Sou muito detetive né? 🕵️‍♀️)`,
            embeds: [embed]
        })
    }
};