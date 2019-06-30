const { Client } = require('discord.js')
const { readFileSync, writeFile } = require('fs')
const db = require('./db.json')

//Criando a config, com token e prefixo
const config = {
    token: 'Seu token lindo e maravilhoso',
    prefixo: '!'
}

//Construindo o cliente
const app = new Client({
    disableEveryone: true,
    fetchAllMembers: true
})

// Evento ready, nada demais!
app.on('ready', () => {
    console.log(`Sistema básico de idioma para bots criado por: https://github.com/iamKowalski\n${app.user.tag} está pronto para uso!`)
})

//Evento "message" é onde tudo acontece
app.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return //ignorando bots e dm's

    if (message.content.indexOf(config.prefixo) != 0) return //ignorando mensagens que não contém o prefixo

    //procurando na db a guild, você também pode usar outro tipo de database...
    const db_guild = JSON.parse(readFileSync('./db.json', 'utf8'))
    if (!db_guild[message.guild.id]) {
        db_guild[message.guild.id] = {
            language: 'pt-BR' //idioma padrão, no meu caso: "pt-BR"
        }
    }

    writeFile("./db.json", JSON.stringify(db_guild), (err) => {
        if (err) console.log(err.message)
    })

    const msg = message.content.slice(config.prefixo.length)
    const args = msg.split(" ") //"!comando [args]"

    const cmd = args[0].toLowerCase() //"![comando] args"
    args.shift()
    const language = db_guild[message.guild.id].language
    const jsonLanguage = require(`./idiomas/${language}.json`)

    if (cmd === 'language') {
        switch (args[0]) {
            case 'pt-BR':
                db_guild[message.guild.id].language = 'pt-BR'
                writeFile("./db.json", JSON.stringify(db_guild), (err) => {
                    if (err) console.log(err.message)
                })
                message.channel.send('Idioma alterado para `Português (Brasil)`[**pt-BR**]')
                break;
            case 'en-US':
                db_guild[message.guild.id].language = 'en-US'
                writeFile("./db.json", JSON.stringify(db_guild), (err) => {
                    if (err) console.log(err.message)
                })
                message.channel.send('Language changed to `English (US)`[**en-US**]')
                break;
            default:
                message.channel.send('**pt-BR** e **en-US** apenas!')
        }
    }
    if (cmd === 'teste' || cmd === 'test') {
        message.channel.send(jsonLanguage.command1.test)
    }
})

app.login(config.token)