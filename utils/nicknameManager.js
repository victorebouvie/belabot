const { NICKNAME } = require('../config')

async function changeNicknames(guild) {
    if (!guild) return console.log('Servidor não encontrado para troca de nicks.')

    try {
        //Tentar pegar do cache primeiro se ele estiver quase cheio, se não faz o fetch
        //Isso economiza requisições caso o bot ja conheça os membros
        let members
        if (guild.memberCount === guild.members.cache.size) {
            members = guild.members.cache
        } else {
            members = await guild.members.fetch().catch(err => {
                //Se der o erro de rate limit, apenas retorna e tenta na proxima vez
                if (err.code === 429) {
                    console.warn("Rate Limit atingido ao buscar membros. Tentar novamente")
                    return null
                }
                throw err
            })
        }

        //Se o fetch falhou para aqui
        if (!members) return

        members.forEach(member => {
            if (member.id === guild.ownerId) return
            if (!member.manageable) return
            if (member.displayName === NICKNAME) return

            member.setNickname(NICKNAME).catch(err => {
                // Silenciar erros comuns de permissão pra não sujar minhas logs
                console.error(`Erro ao alterar ${member.user.tag}: ${err.message}`)
            })
        })
        console.log(`Verificação de apelidos concluida em: ${guild.name}`)
    } catch (error) {
        console.error('Erro critico ao buscar membros:', error)
    }
}

module.exports = { changeNicknames }