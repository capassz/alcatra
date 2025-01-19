const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Role } = require("discord.js");
const axios = require('axios');
const { QuickDB } = require("quick.db");
const { atualizarmensagempainel } = require("./PainelSettingsAndCreate");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB();
var uud = db.table('avaliarrrrr')

async function EntregarProdutos(client) {
    var status = client.db.StatusCompras.fetchAll()
    for (let i = 0; i < status.length; i++) {
        const PaymentName = status[i].ID
        const Status = status[i].data.Status
        const GuildServerID = status[i].data.GuildServerID
        const user = status[i].data.user
        const ID = status[i].data.ID
        const ID2 = status[i]
        const IdCompra = status[i].data.IdCompra
        const Metodo = status[i].data.Metodo

        if (Status == "Aprovado") {
            client.db.StatusCompras.set(`${PaymentName}.Status`, 'Entregue')
            var tbbb = client.db.Carrinho.get(`${ID}`)


            const channel222 = await client.channels.fetch(tbbb.ChannelID).catch()
            await channel222.messages.fetch().then(async (messages) => {
                try {
                    await channel222.bulkDelete(messages)
                } catch (error) {

                }

            })

            var t = client.db.Carrinho.get(`${ID}.produtos`)

            var produtosname = []
            var logmessage1 = ''
            var logmessage2 = ''
            var logmessage3 = ''
            var logmessage4 = ''
            let logmessage5 = ''

            for (let i = 0; i < t.length; i++) {
                for (let key in t[i]) {
                    produtosname.push({
                        Name: key,
                        Qtd: t[i][key].qtd,
                    });

                    logmessage1 += `${client.db.produtos.get(`${key}.settings.name`)} x${t[i][key].qtd}`
                    logmessage2 += client.db.produtos.get(`${key}.settings.name`)
                    logmessage3 += client.db.produtos.get(`${key}.ID`)
                    logmessage4 += `${client.db.produtos.get(`${key}.settings.name`)} - ${t[i][key].qtd}\n`



                    var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)

                    logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`

                    var get = 0
                    var get2 = 0
                    if (client.db.estatisticas.get(`${key}.TotalPrice`) !== null) {
                        get = Number(client.db.estatisticas.get(`${key}.TotalPrice`))
                    }
                    if (client.db.estatisticas.get(`${key}.TotalQtd`) !== null) {
                        get2 = Number(client.db.estatisticas.get(`${key}.TotalQtd`))
                    }

                    client.db.estatisticas.set(`${key}.TotalQtd`, Number(get2) + Number(t[i][key].qtd))
                    client.db.estatisticas.set(`${key}.TotalPrice`, Number(get) + Number(valor))

                    if (i < t.length - 1) {
                        logmessage2 += ', ';
                        logmessage3 += ', ';
                        logmessage1 += ', ';
                    }
                }
            }

            client.db.StatusCompras.set(`${PaymentName}.ProdutosComprados`, logmessage4)


            var ppppopopooopo = ''
            var finalproduto = ''
            var finalproduto2 = ''

            var qtddd = 0
            for (var ie = 0; ie < produtosname.length; ie++) {


                qtddd = qtddd + produtosname[ie].Qtd
                for (var j = 0; j < produtosname[ie].Qtd; j++) {

                    var produto = client.db.produtos.get(`${produtosname[ie].Name}.settings.estoque`)[0]

                    client.db.produtos.pull(`${produtosname[ie].Name}.settings.estoque`, (element, index, array) => index == 0)

                    var produto2 = produto
                    if (produto2 == undefined) produto2 = '\`Estoque desse produto esgotou - Contate um STAFF\`'
                    finalproduto += `${obterEmoji(12)} | Entrega do Produto: ${produtosname[ie].Name} - ${j + 1}/${produtosname[ie].Qtd}\n${produto2}\n\n`
                    finalproduto2 += `${produto2}\n`

                }

                var oooo = client.db.produtos.get(`${produtosname[ie].Name}.embedconfig.cargo.name`)
                var temporole = client.db.produtos.get(`${produtosname[ie].Name}.embedconfig.cargo.tempo`)

                if (oooo !== null) {
                    await client.guilds.cache.get(GuildServerID).members.fetch(user).then(member => member.roles.add(oooo)).catch(console.error);

                    const currentTime = new Date();
                    const timestamp2 = currentTime.getTime();
                    var dkçnajbyoa = temporole * produtosname[ie].Qtd
                    const timestamp = dkçnajbyoa * 24 * 60 * 60 * 1000;
                    bfuu = timestamp2 + timestamp

                    if (temporole !== null) {
                        var gg = client.db.RoleTime.get(user)
                        if (gg && gg.length) {
                            for (let i = 0; i < gg.length; i++) {
                                if (client.db.RoleTime.get(`${user}[${i}].role`) == oooo)
                                    client.db.RoleTime.set(`${user}[${i}].timestamp`, client.db.RoleTime.get(`${user}[${i}].timestamp`) + timestamp);
                                else
                                    await client.db.RoleTime.push(user, { role: oooo, user, timestamp: bfuu, guildid: GuildServerID, produto: client.db.produtos.get(`${produtosname[ie].Name}.settings.name`) });
                            }
                        } else {
                            await client.db.RoleTime.push(user, { role: oooo, user, timestamp: bfuu, guildid: GuildServerID, produto: client.db.produtos.get(`${produtosname[ie].Name}.settings.name`) });
                        }
                    }


                    if (gg && gg.length) {
                        for (let i = 0; i < gg.length; i++) {
                            if (!ppppopopooopo.includes(`<@&${oooo}> - Permanente`) && temporole === null) ppppopopooopo += `<@&${oooo}> - Permanente\n`;
                            let timestamp2 = Math.floor(client.db.RoleTime.get(`${user}[${i}].timestamp`) / 1000);
                            if (!ppppopopooopo.includes(`<@&${oooo}> - Expira em:`)) temporole !== null ? ppppopopooopo += `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n` : '';
                            else if (temporole !== null) ppppopopooopo = ppppopopooopo.replace(new RegExp(`<@&${oooo}> - Expira em:.+`, 'g'), `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n`);
                        }
                    } else {
                        if (!ppppopopooopo.includes(`<@&${oooo}> - Permanente\n`) && temporole === null) ppppopopooopo += `<@&${oooo}> - Permanente\n`;
                        const currentTime = new Date(), timestamp2 = currentTime.getTime(), dkçnajbyoa = temporole * produtosname[ie].Qtd, timestamp = dkçnajbyoa * 24 * 60 * 60 * 1000, bfuu = timestamp2 + timestamp, timestamp22 = Math.floor(bfuu / 1000);
                        if (!ppppopopooopo.includes(`<@&${oooo}> - Expira em:`)) temporole !== null ? ppppopopooopo += `<@&${oooo}> - Expira em: <t:${timestamp22}:R>\n` : '';
                        else if (temporole !== null) ppppopopooopo = ppppopopooopo.replace(new RegExp(`<@&${oooo}> - Expira em:.+`, 'g'), `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n`);
                    }



                }

                var fsfs = client.db.produtos.get(`${produtosname[ie].Name}.settings.estoque`)
                var fsfs2222 = client.db.produtos.get(`${produtosname[ie].Name}.settings.name`)

                if (fsfs.length == 0) {
                    const channela = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

                    try {
                        await channela.send({ content: `Acabou o stock do produto de id: **${produtosname[ie].Name}** Nome: **${fsfs2222}**` })
                    } catch (error) {

                    }
                }



            }

            var kkkkkkk = client.db.PainelVendas.fetchAll()
            const channel = await client.channels.fetch(tbbb.ChannelID).catch()

            for (var bg = produtosname.length - 1; bg >= 0; bg--) {
                var produto = produtosname[bg].Name;
                try {
                    for (const item of kkkkkkk) {
                        for (const p of item.data.produtos) {
                            if (p === produto) {
                                await atualizarmensagempainel(tbbb.GuildServerID, item.ID, client);
                            }
                        }
                    }
                } catch (error) { }
                atualizarmessageprodutosone2(client, produto, tbbb.GuildServerID);
            }

            const member = await client.guilds.cache.get(tbbb.GuildServerID).members.fetch(user);
            if (client.db.General.get('ConfigGeral.ChannelsConfig.CargoCliente') !== null) {
                try {
                    await member.roles.add(client.db.General.get('ConfigGeral.ChannelsConfig.CargoCliente'));
                } catch (error) {
                    // Tratamento de erro
                }
            }
            var fileName
            var fileBuffer2
            var produtoentregarfinal

            fileName = `entrega_produtos.txt`;
            fileBuffer2 = Buffer.from(finalproduto2, 'utf-8');
            produtoentregarfinal = `Seus produtos não cabem aqui!! olhe no TXT abaixo.`

            client.db.StatusCompras.set(`${PaymentName}.valortotal`, Number(tbbb.totalpicecar).toFixed(2))

            let guild = client.guilds.cache.get(GuildServerID)
            const channela = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

            const embedlogsucess = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: `Entrega realizada!`, iconURL: 'https://cdn.discordapp.com/emojis/1230562879116152923.webp?size=44&quality=lossless' })
                .setDescription(`- O usuário <@${user}> teve seu pedido entregue.`)
                .setFields(
                    { name: `Detalhes`, value: `${logmessage5}`, inline: false },
                    { name: `ID do Pedido`, value: `\`${IdCompra}\``, inline: false },
                )
                .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
                .setTimestamp()

            try {
                const canal = await client.channels.fetch(client.db.StatusCompras.get(`${PaymentName}.canal`));
                const msg = await canal.messages.fetch(client.db.StatusCompras.get(`${PaymentName}.msg`));
                await msg.reply({
                    embeds: [embedlogsucess], files: [{ attachment: fileBuffer2, name: fileName }]
                }).then(msg => {
                    client.db.StatusCompras.set(`${PaymentName}.IDMessageLogs`, msg.id);
                    client.db.StatusCompras.set(`${PaymentName}.IDChannelLogs`, msg.channel.id);
                    client.db.StatusCompras.set(`${PaymentName}.produtosentregue`, finalproduto);
                });
            } catch (error) { }

            const embed = new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: `Entrega realizada!`, iconURL: 'https://cdn.discordapp.com/emojis/1182868166813171742.webp?size=44&quality=lossless' })
                .setDescription(`Seu produto foi anexado a essa mensagem.`)
                .addFields(
                    { name: `Detalhes:`, value: `\`${tbbb.messagepagamento}\`` },
                    { name: `Id da Compra:`, value: `\`${IdCompra}\`` },
                )
                .setFooter({text: `Seu(s) Produto(s) estão abaixo:`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null });


            if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                embed.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
            }
            if (client.db.General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
                embed.setThumbnail(client.db.General.get(`ConfigGeral.MiniaturaEmbeds`))
            }

            const embedppppp = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Purple' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                .setAuthor({ name: `Avalie sua compra`, iconURL: 'https://cdn.discordapp.com/emojis/1232378451902730261.webp?size=44&quality=lossless' })
                .setDescription(`- Avalie sua compra de acordo com a qualidade do produto e atendimento.`)

            const row2222 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('1avaliar')
                        .setLabel('1')
                        .setEmoji('⭐')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('2avaliar')
                        .setLabel('2')
                        .setEmoji('⭐')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('3avaliar')
                        .setLabel('3')
                        .setEmoji('⭐')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('4avaliar')
                        .setEmoji('⭐')
                        .setLabel('4')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('5avaliar')
                        .setEmoji('⭐')
                        .setLabel('5')
                        .setStyle(2)
                )

            try { await channel.send(`${obterEmoji(8)} | Pagamento Aprovado\n${obterEmoji(9)} | Id da Compra: ${IdCompra}`) } catch (error) { }

            if (client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`) == "ON") {

                var yui = Number(tbbb.totalpicecar)
                const porcentagem = client.db.General.get(`ConfigGeral.CashBack.Porcentagem`);
                var yty = (yui * porcentagem) / 100;
                if (client.db.PagamentosSaldos.get(`${user}.SaldoAccount`) == null) {
                    client.db.PagamentosSaldos.set(`${user}.SaldoAccount`, Number(yty))
                } else {

                    client.db.PagamentosSaldos.set(`${user}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${user}.SaldoAccount`)) + Number(yty))
                }
                try { await channel.send(`${obterEmoji(4)} | Parabéns o sistema de CASHBACK do servidor está ligado!\n\n💥 | Você recebeu \`${client.db.General.get(`ConfigGeral.CashBack.Porcentagem`)}%\` do valor da compra de volta em **SALDO**\n\n${obterEmoji(4)} | Valor recebido ${Number(yty).toFixed(2)}`) } catch (error) { }
            }

            if (client.db.usuariosinfo.get(`${user}.qtdprodutos`) !== null && client.db.usuariosinfo.get(`${user}.qtdprodutos`) !== undefined) {
                client.db.usuariosinfo.set(`${user}.qtdprodutos`, Number(client.db.usuariosinfo.get(`${user}.qtdprodutos`)) + 1)
            } else {
                client.db.usuariosinfo.set(`${user}.qtdprodutos`, 1)
            }

            if (client.db.usuariosinfo.get(`${user}.gastos`) !== null && client.db.usuariosinfo.get(`${user}.gastos`) !== undefined) {
                client.db.usuariosinfo.set(`${user}.gastos`, Number(client.db.usuariosinfo.get(`${user}.gastos`)) + Number(tbbb.totalpicecar))
            } else {
                client.db.usuariosinfo.set(`${user}.gastos`, Number(tbbb.totalpicecar))
            }

            var date = new Date();
            date.setUTCHours(date.getUTCHours() + 3)
            var dataatual = date.getTime();

            client.db.usuariosinfo.set(`${user}.ultimacompra`, dataatual)


            const today = new Date();
            client.db.estatisticasgeral.set(`${PaymentName}.Status`, 'Entregue')
            client.db.estatisticasgeral.set(`${PaymentName}.Data`, today)
            client.db.estatisticasgeral.set(`${PaymentName}.valortotal`, Number(tbbb.totalpicecar).toFixed(2))
            client.db.estatisticasgeral.set(`${PaymentName}.produtos`, qtddd)

            try {
                await member.send({ embeds: [embed] }).then(async (msg222) => {
                    if (finalproduto.length >= 500) {
                        const embed2 = new EmbedBuilder()
                            .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${obterEmoji(6)} ${client.user.username} | Pagamento Aprovado ${obterEmoji(6)}`)
                            .setDescription(`<@${user}> **Pagamento aprovado verifique sua Dm**\n__Este canal será apagado após 1 minuto__`)

                        const row = new ActionRowBuilder()
                        row.addComponents(
                            new ButtonBuilder()
                                .setURL(msg222.url)
                                .setLabel('Atalho Para DM')
                                .setStyle(5)
                                .setDisabled(false))

                        await channel.send({ embeds: [embed2], components: [row] }).then(msg => {
                            setTimeout(async () => {
                                try {
                                    await channel.delete()
                                } catch (error) {

                                }
                            }, 60000);
                        });

                        await member.send({
                            files: [{
                                attachment: fileBuffer2,
                                name: fileName
                            }]
                        })

                        member.send({
                            embeds: [embedppppp],
                            components: [row2222]
                        }).then(ppppp => {

                            uud.set(ppppp.id, { message: tbbb.messagepagamento2, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID })

                            setTimeout(async () => {
                                var null2 = null
                                avaliacao(null2, ppppp.id, ppppp.channel.id, client, user)

                            }, 300000);
                        })

                    } else {
                        member.send({ content: finalproduto }).then(async msg => {

                            const embed2 = new EmbedBuilder()
                                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                                .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                                .setDescription(`- Olá <@${user}> seu pedido foi aprovado e entregue com sucesso!, verifique sua DM.`)

                            if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                                embed2.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
                            }

                            const row = new ActionRowBuilder()
                            row.addComponents(
                                new ButtonBuilder()
                                    .setURL(msg.url)
                                    .setLabel('Atalho Para DM')
                                    .setStyle(5)
                                )

                            await channel.send({ embeds: [embed2], components: [row] }).then(msg => {
                                setTimeout(async () => {
                                    try {
                                        await channel.delete()
                                    } catch (error) {

                                    }
                                }, 60000);
                            });


                            member.send({
                                embeds: [embedppppp],
                                components: [row2222]
                            }).then(ppppp => {

                                uud.set(ppppp.id, { message: tbbb.messagepagamento2, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID })

                                setTimeout(async () => {
                                    var null2 = null
                                    avaliacao(null2, ppppp.id, ppppp.channel.id, client, user)

                                }, 300000);
                            })


                        })
                    }
                })
            } catch (error) {
                const embed2 = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setDescription(`- Olá <@${user}> seu pedido foi aprovado mas não consegui enviar a mensagem privada, enviarei o produto aqui.`)

                if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                    embed2.setThumbnail(client.db.General.get(`ConfigGeral.BannerEmbeds`))
                }


                if (finalproduto.length >= 500) {
                    await channela.send({
                        embeds: [embed2], files: [{
                            attachment: fileBuffer2,
                            name: fileName
                        }]
                    })
                } else {
                    await channel.send({ embeds: [embed2] }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await channel.delete()
                            } catch (error) {

                            }
                        }, 60000);
                    });

                    try {
                        await channel.send({ content: finalproduto })
                    } catch (error) {

                    }
                }



                try {
                    await channel.send({
                        embeds: [embedppppp],
                        components: [row2222]
                    }).then(async ppppp => {
                        uud.set(ppppp.id, { message: tbbb.messagepagamento2, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID })
                        setTimeout(async () => {
                            var null2 = null
                            avaliacao(null2, ppppp.id, client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`), client, user, GuildServerID)

                        }, 300000);
                    })
                } catch (error) {

                }
            }

            try { if (ppppopopooopo !== '') await channel.send({ content: `${obterEmoji(8)} | Cargos setados:\n${ppppopopooopo}` }); } catch (error) { }

        }
    }
}













async function verificarpagamento(client) {

    var type = client.db.Pagamentos.fetchAll()
    for (let i = 0; i < type.length; i++) {
        const PaymentName = type[i].data.ID;
        const PaymentName22 = type[i].ID;
        const typeValue = type[i].data.Type;
        const PaymentId = type[i].data.PaymentId;
        const IdServer = type[i].data.IdServer;
        const IdServer2 = type[i].data.IdServer2;
        const BodyCompra = type[i].data.BodyCompra;
        const canalidd = type[i].data.CanalID;
        const user = type[i].data.user;

        let channel = await client.channels.cache.get(canalidd)
        if (!channel) {
            client.db.Pagamentos.delete(PaymentName22)
            client.db.StatusCompras.set(`${BodyCompra}.Status`, 'Cancelado')
        }

        if (typeValue == 'site') {
            const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${PaymentId}`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${IdServer}`
            };

            axios.get(url, { headers })
                .then(async (response) => {
                    if (response.status == 200) {
                        const Data = response.data.results[0]
                        if (!Data) return
                        else if (Data.status_detail == 'accredited') {

                            let bancosbloqueados = client.db.General.get('ConfigGeral.BankBlock') || []

                            if (response.data.results[0].point_of_interaction.transaction_data.bank_info !== undefined) {
                                if (bancosbloqueados.length != 0) {
                                    const ffaa11 = client.db.Carrinho.get(`${PaymentName22}`)
                                    if (bancosbloqueados.includes(response.data.results[0].point_of_interaction.transaction_data.bank_info) == true) {

                                        await channel.messages.fetch().then(async (messages) => {
                                            try {
                                                await channel.bulkDelete(messages)
                                            } catch (error) {

                                            }

                                        })
                                        const response = await axios.get(`https://api.mercadopago.com/v1/payments/search?external_reference=${PaymentId}`, {
                                            headers: {
                                                'Authorization': `Bearer ${IdServer}`
                                            }
                                        });
                                        const paymentId = response.data.results[0].id;
                                        const refundResponse = await axios.post(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {}, {
                                            headers: {
                                                'Authorization': `Bearer ${IdServer}`
                                            }
                                        });


                                        const embed = new EmbedBuilder()
                                            .setColor('Red')
                                            .setAuthor({ name: `Pagamento não aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562894467436565.webp?size=44&quality=lossless' })
                                            .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${response.data.results[0].point_of_interaction.transaction_data.bank_info.payer.long_name}\`, seu dinheiro foi reembolsado, tente novamente usando outro banco.`)
                                            .addFields(
                                                { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` },
                                                { name: `ID do Pedido`, value: `\`${BodyCompra}\``, inline: false }
                                            )
                                            


                                        const embed2 = new EmbedBuilder()
                                            .setColor('Red')
                                            .setAuthor({ name: `Pedido não aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562894467436565.webp?size=44&quality=lossless' })
                                            .setDescription(`Usuário <@!${user}> teve o dinheiro reembolsado e o produto não entregue, pelo motivo do banco \`${response.data.results[0].point_of_interaction.transaction_data.bank_info.payer.long_name}\`. estar na lista de bancos bloqueados.`)
                                            .setFields(
                                                { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` },
                                                { name: `ID do Pedido`, value: `\`${BodyCompra}\``, inline: false },
                                            )



                                        try {
                                            const channela = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                                            channela.send({ embeds: [embed2] })
                                        } catch (error) {

                                        }

                                        const agora = Math.floor(new Date().getTime() / 1000);
                                        const novoTimestamp = agora + 60;

                                        channel.send({ content: `<@${user}>, Este canal será excluido em <t:${novoTimestamp}:R>`, embeds: [embed] }).then(deletechannel => {
                                            setInterval(async () => {
                                                try {
                                                    await channel.delete()
                                                } catch (error) {

                                                }
                                            }, 60000);
                                        })
                                        client.db.Pagamentos.delete(PaymentName22)
                                        return
                                    }

                                }
                            }

                            var iddd = response.data.results[0].id

                            let canal
                            let msg
                            try {
                                canal = client.db.StatusCompras.get(`${BodyCompra}.canal`)
                                msg = client.db.StatusCompras.get(`${BodyCompra}.msg`)
                            } catch (error) {}

                            const today = new Date();
                            client.db.StatusCompras.delete(BodyCompra)

                            client.db.StatusCompras.set(`${iddd}.Status`, 'Aprovado')
                            client.db.StatusCompras.set(`${iddd}.Data`, today)
                            client.db.StatusCompras.set(`${iddd}.Metodo`, 'Site')
                            client.db.StatusCompras.set(`${iddd}.IdPreference`, PaymentId)
                            client.db.StatusCompras.set(`${iddd}.GuildServerID`, IdServer2)
                            client.db.StatusCompras.set(`${iddd}.ID`, PaymentName22)
                            client.db.StatusCompras.set(`${iddd}.user`, user)
                            client.db.StatusCompras.set(`${iddd}.IdCompra`, iddd)
                            client.db.StatusCompras.set(`${iddd}.canal`, canal)
                            client.db.StatusCompras.set(`${iddd}.msg`, msg)
                            
                            // APROVAR SITE

                            var t = client.db.Carrinho.get(`${PaymentName22}.produtos`)

                            let logmessage5 = ''
                            let guild = client.guilds.cache.get(client.db.Carrinho.get(`${PaymentName22}.GuildServerID`))

                            for (let i = 0; i < t.length; i++) {
                                for (let key in t[i]) {

                                    var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                                    logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                                }
                            }

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                                .setColor('Green')
                                .setDescription(`Usuário <@!${client.db.StatusCompras.get(`${iddd}.user`)}> teve seu pedido aprovado`)
                                .setFields(
                                    { name: `Detalhes`, value: logmessage5, inline: false },
                                    { name: `ID do Pedido`, value: `\`${iddd}\``, inline: false },
                                    { name: `Banco`, value: `\`${response.data.results[0].point_of_interaction.transaction_data.bank_info.payer.long_name}\``, inline: false }
                                )
                                .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
                                .setTimestamp()

                            const row222 = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                    .setCustomId('ReembolsarCompra')
                                    .setLabel('Reembolsar')
                                    .setEmoji('1243421135673229362')
                                    .setStyle(2)
                                );

                            let msglog
                            try {
                                const canal2 = await client.channels.fetch(client.db.StatusCompras.get(`${iddd}.canal`));
                                const msg2 = await canal2.messages.fetch(client.db.StatusCompras.get(`${iddd}.msg`));
                                msglog = await msg2.reply({ embeds: [embed], components: [row222] })
                                await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                                await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                            } catch (error) { }


                            EntregarProdutos(client)
                            client.db.Pagamentos.delete(PaymentName22)
                        }
                    }
                })
        }

        if (typeValue == 'pix') {
            var res = await axios.get(`https://api.mercadopago.com/v1/payments/${BodyCompra}`, {
                headers: {
                    Authorization: `Bearer ${IdServer}`
                }
            })

            if (res.data.status == 'approved') { // approved ou approved

                let bancosbloqueados = client.db.General.get('ConfigGeral.BankBlock') || []
                if (bancosbloqueados.length !== 0) {
                    const ffaa11 = client.db.Carrinho.get(`${PaymentName22}`)
                    if (bancosbloqueados.includes(res.data.point_of_interaction.transaction_data.bank_info.payer.long_name) == true) {

                        await channel.messages.fetch().then(async (messages) => {
                            try {
                                await channel.bulkDelete(messages)
                            } catch (error) {

                            }

                        })

                        const urlReembolso = `https://api.mercadopago.com/v1/payments/${BodyCompra}/refunds`;
                        const headers = {
                            Authorization: `Bearer ${IdServer}`,
                        };
                        const body = {
                            metadata: {
                                reason: 'Banco Bloqueado!',
                            },
                        };
                        axios.post(urlReembolso, body, { headers })
                            .then(async response => {

                                const embed = new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({ name: `Pedido #${BodyCompra}` })
                                    .setTitle(`Pedido não aprovado`)
                                    .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\`, seu dinheiro foi reembolsado, tente novamente usando outro banco.`)
                                    .addFields(
                                        { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` }
                                    )

                                const embed2 = new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({ name: `Pedido #${BodyCompra}` })
                                    .setTitle(`Anti Banco | Nova Venda`)
                                    .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\`, o dinheiro do Comprador foi reembolsado, Obrigado por confiar em meu trabalho.`).addFields(
                                        { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` }
                                    )

                                try {
                                    const canal2 = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                                    const msg2 = await canal2.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                                    msg2.reply({ embeds: [embed2], content: `<@${user}>` })
                                } catch (error) {

                                }

                                const agora = Math.floor(new Date().getTime() / 1000);
                                const novoTimestamp = agora + 60;

                                channel.send({ content: `<@${user}>, Este canal será excluido em <t:${novoTimestamp}:R>`, embeds: [embed] }).then(deletechannel => {
                                    setInterval(async () => {
                                        try {
                                            await channel.delete()
                                        } catch (error) {

                                        }
                                    }, 60000);
                                })


                            })
                            .catch(error => {

                                console.error('Erro ao emitir o reembolso:', error.response.data);
                            });
                        client.db.Pagamentos.delete(PaymentName22)
                        return
                    }
                }
                client.db.StatusCompras.set(`${BodyCompra}.Status`, 'Aprovado')

                const today = new Date();

                client.db.StatusCompras.set(`${BodyCompra}.Data`, today)
                client.db.StatusCompras.set(`${BodyCompra}.IdCompra`, BodyCompra)
                client.db.StatusCompras.set(`${BodyCompra}.Metodo`, 'Pix')

                // APROVAR PIX 
                var t = client.db.Carrinho.get(`${PaymentName22}.produtos`)

                let logmessage5 = ''
                let guild = client.guilds.cache.get(client.db.Carrinho.get(`${PaymentName22}.GuildServerID`))

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                    }
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${client.db.StatusCompras.get(`${BodyCompra}.user`)}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${BodyCompra}\``, inline: false },
                        { name: `Banco`, value: `\`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\``, inline: false }
                    )
                    .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
                    .setTimestamp()

                const row222 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ReembolsarCompra')
                            .setLabel('Reembolsar')
                            .setEmoji('1243421135673229362')
                            .setStyle(2)
                    );

                let msglog
                try {
                    const canal = await client.channels.fetch(client.db.StatusCompras.get(`${BodyCompra}.canal`));
                    const msg = await canal.messages.fetch(client.db.StatusCompras.get(`${BodyCompra}.msg`));
                    msglog = await msg.reply({ embeds: [embed], components: [row222] })
                    await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                    await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                } catch (error) { }

                EntregarProdutos(client)
                client.db.Pagamentos.delete(PaymentName22)

            }
        }

    }
}

async function atualizarmessageprodutosone2(client, produto, serverid) {

    var s = client.db.produtos.get(`${produto}.settings.estoque`)
    var dd = client.db.produtos.get(`${produto}`)

    const embeddesc = client.db.DefaultMessages.get("ConfigGeral")


    var modifiedEmbeddesc = embeddesc.embeddesc
        .replace('#{desc}', client.db.produtos.get(`${produto}.settings.desc`))
        .replace('#{nome}', client.db.produtos.get(`${produto}.settings.name`))
        .replace('#{preco}', Number(client.db.produtos.get(`${produto}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length);

    var modifiedEmbeddesc2 = embeddesc.embedtitle
        .replace('#{nome}', client.db.produtos.get(`${produto}.settings.name`))
        .replace('#{preco}', Number(client.db.produtos.get(`${produto}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length)

    const embed = new EmbedBuilder()
        .setTitle(modifiedEmbeddesc2)
        .setDescription(modifiedEmbeddesc)
        .setColor(`${dd.embedconfig.color == null ? '#000000' : dd.embedconfig.color}`)

    if (dd.embedconfig.banner !== null) {
        embed.setImage(dd.embedconfig.banner)
    }
    if (dd.embedconfig.miniatura !== null) {
        embed.setThumbnail(dd.embedconfig.miniatura)
    }
    try {
        const channel = await client.channels.fetch(dd.ChannelID);
        const fetchedMessage = await channel.messages.fetch(dd.MessageID);

        await fetchedMessage.edit({ embeds: [embed] });
    } catch (error) {

    }
}

async function avaliacao(interaction, pp, canalId, client, user) {
    var tttttt = await uud.get(pp)
    var avaliar22
    try {
        avaliar22 = interaction.fields.getTextInputValue('avaliar');
    } catch (error) {
        avaliar22 = null
    }

    const canal = client.channels.cache.get(canalId)
    try {


        await canal.messages.fetch(pp)
            .then(async (mensagem) => {

                await mensagem.edit({ content: `${obterEmoji(8)} | Obrigado por avaliar!`, embeds: [], components: [] }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) {
                        }
                    }, 2000);
                })
            })
    } catch (error) {
        return
    }
    function transformarEmEstrelas(numero) {
        return '\u2B50'.repeat(numero);
    }
    const member = await client.guilds.cache.get(tttttt.guildid).members.fetch(user);

    var mensagemfinal

    var result = null



    if (tttttt.resultado !== null) {
        result = tttttt.resultado
    }



    if (result == null) {
        mensagemfinal = `\`Nenhuma Avaliação\``
    } else {
        mensagemfinal = `${transformarEmEstrelas(result)} (${result})`

        if (avaliar22 !== ``) {
            mensagemfinal = `${transformarEmEstrelas(result)} (${result})\n**__${member.user.username}__:** \`${avaliar22}\``
        } else {
            mensagemfinal = `${transformarEmEstrelas(result)} (${result})\n**__${member.user.username}__:** \`Nenhum Comentário Adicional.\``
        }
    }

    let guild = client.guilds.cache.get(tttttt.guildid)

    const embedppppp = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: `Compra realizada!`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
        .setDescription(`O usuário <@${user}> realizou uma compra em nosso servidor.`)
        .setFields(
            { name: `Carrinho`, value: `\`${tttttt.message}\`` },
            { name: `Valor pago`, value: `\`R$ ${Number(tttttt.valorpago).toFixed(2)}\`` },
        )
        .setFooter({ text: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) ? guild.iconURL({ dynamic: true }) : null })
        .setTimestamp()

    if (tttttt.valordodesconto != null) {
        embedppppp.addFields({ name: `Desconto`, value: `\`R$ ${Number(tttttt.valordodesconto)}\`` })
    }
    if (mensagemfinal !== `\`Nenhuma Avaliação\``) {
        embedppppp.addFields({ name: `Mensagem`, value: `${mensagemfinal}` })
    }

    if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
        embedppppp.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
    }


    try {
        const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`))
        channel.send({ embeds: [embedppppp], content: `<@${user}>` })
    } catch (error) {

    }

}


module.exports = {
    EntregarProdutos,
    verificarpagamento,
    atualizarmessageprodutosone2,
    avaliacao
};