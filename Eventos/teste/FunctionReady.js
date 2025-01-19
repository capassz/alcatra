const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, WebhookClient } = require('discord.js');
const { carregarCache, deletePastEmojis } = require('../../Handler/EmojiFunctions');
const config2 = require("../../config.json");
const { VarreduraBlackList } = require('../../FunctionsAll/Blacklist');
const mercadopago = require('mercadopago');
const fs = require('fs');
const { JsonDatabase } = require('wio.db');
const { SendAllMgs, SelectProduct } = require('../../FunctionsAll/SendAllMgs');

module.exports = {
    name: 'ready',

    run: async (client) => {

        console.log(`\x1b[36m[INFO]\x1b[32m ${client.user.tag} Foi iniciado - Atualmente ${client.guilds.cache.size} servidores! - Tendo acesso a ${client.channels.cache.size} canais! - Contendo ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuarios!\x1b[0m`);


        const databasePath = `./DataBaseJson`;

        let a = 1
        /*
        if (!fs.existsSync(databasePath)) {
            fs.mkdirSync(databasePath, { recursive: true });
            a = 1
        }
        */
        setInterval(() => {
            let horarioatual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' });
            let horarioabertura = client.db.General.get('ConfigGeral.autolock.abertura')
            if (horarioabertura == null) return
            let horariofechamento = client.db.General.get('ConfigGeral.autolock.fechamento')
            let canais = client.db.General.get('ConfigGeral.autolock.canais')
            if (canais == null || canais.length == 0) return
            let sistema = client.db.General.get('ConfigGeral.autolock.status')
            let tipo = client.db.General.get('ConfigGeral.autolock.tipo') || 'nada'

            if (sistema == false) return

            if (horarioatual == horarioabertura) {
                if (tipo == 'aberto') return
                client.db.General.set('ConfigGeral.autolock.tipo', 'aberto')

                try {
                    const canallogs = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Sistema Auto-Lock`, iconURL: `https://cdn.discordapp.com/emojis/1230562921822683176.webp?size=44&quality=lossless` })
                        .setColor('#adffc7')
                        .setDescription(`Seu Bot iniciou um processo de abertura automática de canais.`)
                        .setFields(
                            { name: `Horário de Fechamento`, value: `\`${horariofechamento}\``, inline: true },
                        )


                    const botao = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('repostagemautomaticaaaaaaaaaaaaa')
                            .setLabel('Sistema Auto-lock')
                            .setStyle(2)
                            .setDisabled(true)
                    )

                    canallogs.send({ embeds: [embed], components: [botao] })
                } catch (error) { }

                canais.forEach(async (canal) => {
                    let channel
                    try {
                        channel = await client.channels.fetch(canal)
                        await channel.permissionOverwrites.edit(channel.guild.id, {
                            SendMessages: true
                        })
                    } catch (error) { }

                    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemabertura') || {};

                    const {
                        content = 'Não definido',
                        contentimage = 'Não definido',
                        title = 'Não definido',
                        description = 'Não definido',
                        color = 'Não definido',
                        banner = 'Não definido',
                        thumbnail = 'Não definido',
                    } = mensagem;

                    const embedexample = new EmbedBuilder()

                    if (title !== 'Não definido') {
                        embedexample.setTitle(title)
                    }

                    if (description !== 'Não definido') {
                        embedexample.setDescription(description)
                    }

                    if (color !== 'Não definido') {
                        embedexample.setColor(color)
                    }

                    if (banner !== 'Não definido') {
                        embedexample.setImage(banner)
                    }

                    if (thumbnail !== 'Não definido') {
                        embedexample.setThumbnail(thumbnail)
                    }

                    const updateOptions = {
                        content: content !== 'Não definido' ? content : '',
                        embeds: title !== 'Não definido' ? [embedexample] : [],
                        files: contentimage !== 'Não definido' ? [contentimage] : []
                    }

                    try {
                        let mensagem = await client.messages.fetch(client.db.General.get(`ConfigGeral.autolock.ulitimamensagem.msgid`))
                        await mensagem.delete()
                    } catch (error) { }
                    try {
                        channel.send(updateOptions).then((msg) => {
                            client.db.General.set(`ConfigGeral.autolock.ulitimamensagem`, {
                                msgid: msg.id,
                                canalid: msg.channel.id
                            })
                        })
                    } catch (error) { }
                })
            }
            if (horarioatual == horariofechamento) {
                if (tipo == 'fechado') return
                client.db.General.set('ConfigGeral.autolock.tipo', 'fechado')

                try {
                    const canallogs = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Sistema Auto-Lock`, iconURL: `https://cdn.discordapp.com/emojis/1230562921822683176.webp?size=44&quality=lossless` })
                        .setColor('#adffc7')
                        .setDescription(`Seu Bot iniciou um processo de fechamento automático de canais.`)
                        .setFields(
                            { name: `Horário de Abertura`, value: `\`${horarioabertura}\``, inline: true },
                        )

                    const botao = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('repostagemautomaticaaaaaaaaaaaaa')
                            .setLabel('Sistema Auto-lock')
                            .setStyle(2)
                            .setDisabled(true)
                    )

                    if (client.db.General.get(`ConfigGeral.autolock.apagarmensagens`) == true) {
                        embed.addFields({ name: `Sistema de Limpeza`, value: `O sistema de limpeza está ativado, o BOT irá apagar todas as mensagens do canal antes de tranca-lo.`, inline: true })
                    }

                    canallogs.send({ embeds: [embed], components: [botao] })
                } catch (error) { }

                canais.forEach(async (canal) => {
                    let channel
                    try {
                        channel = await client.channels.fetch(canal)
                        await channel.permissionOverwrites.edit(channel.guild.id, {
                            SendMessages: false
                        })
                    } catch (error) { }

                    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemfechamento') || {};

                    const {
                        content = 'Não definido',
                        contentimage = 'Não definido',
                        title = 'Não definido',
                        description = 'Não definido',
                        color = 'Não definido',
                        banner = 'Não definido',
                        thumbnail = 'Não definido',
                    } = mensagem;

                    const embedexample = new EmbedBuilder()

                    if (title !== 'Não definido') {
                        embedexample.setTitle(title)
                    }

                    if (description !== 'Não definido') {
                        embedexample.setDescription(description)
                    }

                    if (color !== 'Não definido') {
                        embedexample.setColor(color)
                    }

                    if (banner !== 'Não definido') {
                        embedexample.setImage(banner)
                    }

                    if (thumbnail !== 'Não definido') {
                        embedexample.setThumbnail(thumbnail)
                    }

                    const updateOptions = {
                        content: content !== 'Não definido' ? content : '',
                        embeds: title !== 'Não definido' ? [embedexample] : [],
                        files: contentimage !== 'Não definido' ? [contentimage] : []
                    };

                    try {
                        let canal = await client.channels.fetch(client.db.General.get(`ConfigGeral.autolock.ulitimamensagem.canalid`))
                        let mensagem = await canal.messages.fetch(client.db.General.get(`ConfigGeral.autolock.ulitimamensagem.msgid`))
                        await mensagem.delete()
                    } catch (error) { }

                    if (client.db.General.get(`ConfigGeral.autolock.apagarmensagens`) == true) {
                        try {
                            const messages = await channel.messages.fetch()
                            let mensagens = 0
                            for (const message of messages.values()) {
                                try {
                                    await message.delete()
                                    mensagens++
                                } catch (error) {

                                }
                            }


                            embedexample.setFooter({ text: `Foram apagadas ${mensagens} mensagens.`, iconURL: `https://cdn.discordapp.com/emojis/1242904983343468574.webp?size=44&quality=lossless` })
                        } catch (error) { }
                    } else {
                        embedexample.setFooter({ text: `${channel.guild.name}`, iconURL: channel.guild.iconURL({ dynamic: true }) ? channel.guild.iconURL({ dynamic: true }) : null })
                    }

                    embedexample.setTimestamp()

                    try {
                        channel.send(updateOptions).then((msg) => {
                            client.db.General.set(`ConfigGeral.autolock.ulitimamensagem`, {
                                msgid: msg.id,
                                canalid: msg.channel.id
                            })
                        })
                    } catch (error) { }
                })
            }
        }, 5000);

        setInterval(() => {
            if (client.db.General.get(`ConfigGeral.repostagemautomatica.status`) == true) {
                if (client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`) != null) {
                    let horario1 = client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`)
                    let horario2 = client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`) || undefined
                    let horario3 = client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`) || undefined
                    let horarioatual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Sao_Paulo' });

                    let dia = new Date().getDate();
                    let mes = new Date().getMonth()
                    let ano = new Date().getFullYear()
                    let data = `${dia}/${mes}/${ano}`

                    let notificado1 = client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario1.data`) == data
                    let notificado2 = client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario2.data`) == data
                    let notificado3 = client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario3.data`) == data

                    let entrar
                    let type

                    if (horario1 <= horarioatual && !notificado1) {
                        entrar = true
                        type = 'horario1'
                    } else if (horario2 <= horarioatual && !notificado2) {
                        entrar = true
                        type = 'horario2'
                    } else if (horario3 <= horarioatual && !notificado3) {
                        entrar = true
                        type = 'horario3'
                    }


                    if (entrar) {
                        client.db.General.set(`ConfigGeral.repostagemautomatica.ultimarepostagem_${type}`, {
                            data: data,
                            hora: Date.now()
                        })

                        try {
                            const canallogs = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `Repostagem Automática`, iconURL: `https://cdn.discordapp.com/emojis/1230562921822683176.webp?size=44&quality=lossless` })
                                .setColor('#adffc7')
                                .setDescription(`Seu Bot iniciou um processo para repostar todas as mensagens de venda no servidor.`)
                              

                            const botao = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setCustomId('repostagemautomaticaaaaaaaaaaaaa')
                                    .setLabel('Notificação do Sistema')
                                    .setStyle(2)
                                    .setDisabled(true)
                            )

                            canallogs.send({ embeds: [embed], components: [botao] })

                        } catch (error) { }

                        if (client.db.General.get(`ConfigGeral.ConfigGeral.produtosrespostar`) != null && client.db.General.get(`ConfigGeral.ConfigGeral.produtosrespostar`).length > 0) {
                            SelectProduct(client, 'automatica')
                        } else {
                            SendAllMgs(client, 'automatica')
                        }
                    }
                }
            }
        }, 5000)

        async function foiNotificado(horario, data) {
            return client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_${horario}.data`) === data
        }

        carregarCache(client.user.id)

        client.db = {
            Mensagens: new JsonDatabase({
                databasePath: `${databasePath}/Mensagens.json`
            }),
            drops: new JsonDatabase({
                databasePath: `${databasePath}/drops.json`
            }),
            giftcards: new JsonDatabase({
                databasePath: `${databasePath}/giftcards.json`
            }),
            General: new JsonDatabase({
                databasePath: `${databasePath}/General.json`
            }),
            PagamentosSaldos: new JsonDatabase({
                databasePath: `${databasePath}/PagamentosSaldos.json`
            }),
            Keys: new JsonDatabase({
                databasePath: `${databasePath}/Keys.json`
            }),
            produtos: new JsonDatabase({
                databasePath: `${databasePath}/produtos.json`
            }),
            estatisticas: new JsonDatabase({
                databasePath: `${databasePath}/estatisticas.json`
            }),
            DefaultMessages: new JsonDatabase({
                databasePath: `${databasePath}/DefaultMessages.json`
            }),
            Carrinho: new JsonDatabase({
                databasePath: `${databasePath}/Carrinho.json`
            }),
            Pagamentos: new JsonDatabase({
                databasePath: `${databasePath}/Pagamentos.json`
            }),
            Cupom: new JsonDatabase({
                databasePath: `${databasePath}/Cupom.json`
            }),
            StatusCompras: new JsonDatabase({
                databasePath: `${databasePath}/StatusCompras.json`
            }),
            RoleTime: new JsonDatabase({
                databasePath: `${databasePath}/RoleTime.json`
            }),
            PainelVendas: new JsonDatabase({
                databasePath: `${databasePath}/PainelVendas.json`
            }),
            usuariosinfo: new JsonDatabase({
                databasePath: `${databasePath}/usuariosinfo.json`
            }),
            estatisticasgeral: new JsonDatabase({
                databasePath: `${databasePath}/estatisticasgeral.json`
            }),
            sugerir: new JsonDatabase({
                databasePath: `${databasePath}/sugerir.json`
            }),
            invite: new JsonDatabase({
                databasePath: `${databasePath}/invite.json`
            }),
            blacklist: new JsonDatabase({
                databasePath: `${databasePath}/blacklist.json`
            }),
            entradas: new JsonDatabase({
                databasePath: `${databasePath}/entradas.json`
            }),
            blacklistAll: new JsonDatabase({
                databasePath: `${databasePath}/blacklistAll.json`
            }),
            OAuth2: new JsonDatabase({
                databasePath: `${databasePath}/OAuth2.json`
            }),
        };


        if (a == 1) {
            const defaultEmojis = {
                "1": "⚙️",
                "2": "🛒",
                "3": "💳",
                "4": "💰",
                "5": "🏆",
                "6": "🎉",
                "7": "🔍",
                "8": "✅",
                "9": "➡️",
                "10": "🔄",
                "11": "🔑",
                "12": "📦",
                "13": "👥",
                "14": "💸",
                "15": "🤝",
                "16": "🎁",
                "17": "📅",
                "18": "🔗",
                "19": "📰",
                "20": "🔒",
                "21": "❗",
                "22": "❌",
                "23": "💫",
                "24": "⚡",
                "25": "💎",
                "26": "👑",
                "27": "🔔",
                "28": "🪐",
                "29": "📣",
                "30": "🚨",
                "31": "🚪",
                "32": "🆔",
                "33": "✨"
            }

            client.db.DefaultMessages.set(`ConfigGeral`, {
                embeddesc: "\n#{desc}\n\n💸 **| Valor à vista:** `#{preco}`\n📦 **| Restam:** `#{estoque}`",
                embedtitle: "#{nome} | Produto",
                emojibutton: "1243275863827546224"
            })

            client.db.General.set(`ConfigGeral`, {
                Status: "ON",
                ColorEmbed: "#2b2d31",
                TermosCompra: "Não definido",
                MercadoPagoConfig: {
                    PixToggle: "OFF",
                    SiteToggle: "OFF",
                    TimePagament: "20",
                    TokenAcessMP: ""
                },
                SaldoConfig: {
                    SaldoStatus: "ON",
                    Bonus: "10",
                    ValorMinimo: "10"
                },
                SemiAutoConfig: {
                    SemiAutoStatus: "ON",
                    typepix: "",
                    pix: "",
                    qrcode: ""
                },
                CashBack: {
                    ToggleCashBack: "OFF",
                    Porcentagem: "10"
                },
                StatusBot: {
                    typestatus: null,
                    ativistatus: null,
                    textstatus: null,
                    urlstatus: null
                },
                perms: []
            })

            //set na pasta de emojis
        }



        let ddd  = client.db.produtos.fetchAll()
        function removeLastPartFromID(item) {
            const lastUnderscoreIndex = item.ID.lastIndexOf('_');
            if (lastUnderscoreIndex !== -1) {
                item.newID = item.ID.substring(0, lastUnderscoreIndex);
            } else {
                item.newID = item.ID;
            }
            return item;
        }
        
        const updatedData = ddd.map(removeLastPartFromID);
        
        for (let item of updatedData) {
            const originalID = item.ID;
            const newID = item.newID;
        
            if (originalID !== newID) {
                const data = await client.db.produtos.get(originalID);
        
                if (data) {
                    await client.db.produtos.delete(originalID);
        
                    data.ID = newID;
                    await client.db.produtos.set(newID, data);
                }
            }
        }

        if (client.guilds.cache.size > 1) {
            client.guilds.cache.forEach(guild => {
                guild.leave()
                    .then(() => {
                        console.log(`Bot saiu do servidor: ${guild.name}`);
                    })
                    .catch(error => {
                        console.error(`Erro ao sair do servidor: ${guild.name}`, error);
                    });
            });
        }

        setTimeout(() => {
            if (client.db.General.get(`ConfigGeral.repostagemautomatica.reiniciar`) == true) {
                if (client.db.General.get(`ConfigGeral.ConfigGeral.produtosrespostar`) != null && client.db.General.get(`ConfigGeral.ConfigGeral.produtosrespostar`).length > 0) {
                    SelectProduct(client, 'automatica')
                } else {
                    SendAllMgs(client, 'automatica')
                }
            }
        }, 5000);

        const agora = new Date();
        const horarioBrasil = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

        setInterval(() => {
            if (horarioBrasil.getHours() === 2 && horarioBrasil.getMinutes() === 30) {
                VarreduraBlackList(client)
            }
        }, 40000);



        let config = {
            method: 'GET',
            headers: {
                'Authorization': 'SUASENHA'
            }
        };

        // const ddddd = await fetch(`http://apivendas.squareweb.app/api/v1/Console2/${client.user.id}`, config)
        // const info = await ddddd.json()
        // await fetch(`http://apivendas.squareweb.app/api/v1/Console3/${client.user.id}`, config)

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Aplicação Reiniciada`, iconURL: 'https://cdn.discordapp.com/emojis/1230562923168923738.webp?size=44&quality=lossless' })
            .setColor('#2b2d31')
            .addFields(
                { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}> (<t:${Math.ceil(Date.now() / 1000)}:R>)`, inline: true },
                { name: `**Versão**`, value: `\`1.0.0\``, inline: true },
                { name: `**Motivo**`, value: `\`'Reinicialização feita pelo cliente.'\``, inline: false }
            )
            .setTimestamp()
        try {
            const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))
            await channel.send({ components: [], embeds: [embed] })
        } catch (error) {
            // console.log(error)
        }

        await VarreduraBlackList(client)





        function statusatt() {

            if (client.db.General.get(`ConfigGeral.StatusBot.typestatus`) == null) {

                client.user.setPresence({
                    activities: [{ name: `Rare Apps`, type: ActivityType.Streaming, url: `https://www.twitch.tv/discord` }],
                    status: `ndn`,
                })

                return
            }
            var type = client.db.General.get(`ConfigGeral.StatusBot.typestatus`)
            var atividade = client.db.General.get(`ConfigGeral.StatusBot.ativistatus`)
            var text = client.db.General.get(`ConfigGeral.StatusBot.textstatus`)
            var url = client.db.General.get(`ConfigGeral.StatusBot.urlstatus`)

            var dddddd = []

            if (atividade == "Jogando") {
                dddddd = [{ name: text, type: ActivityType.Playing }]
            } else if (atividade == "Assistindo") {
                dddddd = [{ name: text, type: ActivityType.Watching }]
            } else if (atividade == "Competindo") {
                dddddd = [{ name: text, type: ActivityType.Competing }]
            } else if (atividade == "Transmitindo") {
                dddddd = [{ name: text, type: ActivityType.Streaming, url: url }]
            } else if (atividade == "Ouvindo") {
                dddddd = [{ name: text, type: ActivityType.Listening }]
            }


            if (type == 'Online') {
                type = 'online'
            } else if (type == 'Ausente') {
                type = 'idle'
            } else if (type == 'Invisível') {
                type = 'invisible'
            } else if (type == 'Não Perturbar') {
                type = 'dnd'
            }

            client.user.setPresence({
                activities: dddddd,
                status: type,
            })
        }

        i = 0;
        setInterval(() => statusatt(), 4000);



    }
}
