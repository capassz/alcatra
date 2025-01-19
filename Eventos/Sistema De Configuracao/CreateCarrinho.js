const { InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, AttachmentBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const mercadopago = require("mercadopago");
const lastReturnTimes = {};
const cooldownTime = 3;

const lastReturnTimes2 = {};
const cooldownTime2 = 10;
let processing = {}

const { QuickDB } = require("quick.db");
const { verificarpagamento, EntregarProdutos } = require('../../FunctionsAll/ChackoutPagamentoNovo');
const { obterEmoji } = require('../../Handler/EmojiFunctions');
const db = new QuickDB();
var uu = db.table('permcaraddcreate')
var osidsujdwjp = db.table('permissaointeragerclick')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


        const editMessage = async (message) => {

            try {

                const resultado = message.channel.topic.replace('carrinho_', '');
                const member = await interaction.guild.members.fetch(resultado);
                client.db.Carrinho.delete(interaction.channel.topic)

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                    .setDescription(`O tempo para o pagamento expirou.`)
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                await member.send({ embeds: [embed] })
            } catch (error) {

            }

            try {
                if (client.db.General.get(`ConfigGeral.statuslogcompras`) !== false) {
                    const embedppppp = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                        .setDescription(`Usuário ${interaction.user} deixou o pagamento expirar.`)
                        .setFields(
                            { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                        )
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()

                    const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
                    await channel.send({ embeds: [embedppppp] })
                }
            } catch (error) {

            }

            try {
                client.db.Carrinho.delete(message.channel.topic)
                await message.channel.delete()
            } catch (error) {

            }

        };

        const createCollector = (message) => {

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000
            });

            collector.on('collect', () => {
                collector.stop();
            });

            collector.on('end', (collected) => {

                if (collected.size === 0) {
                    editMessage(message);

                }
            });
        };

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'addcupomcarlast') {

                const Cupom22 = interaction.fields.getTextInputValue('addcupomcarlast');

                var ppp = client.db.Cupom.get(Cupom22)
                var carr = client.db.Carrinho.get(interaction.channel.topic)

                if (ppp == null) return interaction.reply({ content: `${obterEmoji(22)} | Cupom invalído`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                if (ppp.quantidade <= 0) return interaction.reply({ content: `${obterEmoji(22)} | Todas quantidades dísponiveis do CUPOM foram utilizadas.`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                if (Number(carr.totalpicecar) < ppp.valorminimo) return interaction.reply({ content: `${obterEmoji(22)} | O valor mínimo para utilizar esse cupom e de \`R$${Number(ppp.valorminimo).toFixed(2)}\``, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                const member = await interaction.guild.members.fetch(interaction.user.id);
                if (ppp.cargo !== undefined) if (!member.roles.cache.has(ppp.cargo)) return interaction.reply({ content: `${obterEmoji(22)} | Este cupom e permitido apenas se você tiver o CARGO <@&${ppp.cargo}>`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                var carr22222 = client.db.Carrinho.get(`${interaction.channel.topic}.cupomaplicado`)
                if (carr22222 !== null) return interaction.reply({ content: `${obterEmoji(22)} | Você já aplicou um CUPOM neste produto.`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })


                var carr2 = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)
                var nomes = carr2.map(obj => Object.keys(obj)[0]);

                var nomespossui = []
                var nomespossui22 = []
                var nomespossui23 = []
                var cupomaplicatotal = 0
                if (ppp.categoria !== null) {
                    for (var i = 0; i < nomes.length; i++) {
                        var nome = nomes[i];
                        var p = client.db.produtos.get(`${nome}.embedconfig.categoria`)
                        if (p == ppp.categoria) {
                            nomespossui.push(nome)

                        }
                    }

                    if (nomespossui == 0) {
                        for (var i = 0; i < nomes.length; i++) {

                            var nome = nomes[i];

                            var p = client.db.produtos.get(`${nome}.embedconfig.cupom`)

                            if (p == true) {
                                nomespossui22.push(nome)

                            }
                        }

                    } else {
                        for (let i = 0; i < nomespossui.length; i++) {
                            const name = nomespossui[i];

                            for (var i2 = 0; i2 < carr2.length; i2++) {
                                var objeto = carr2[i2];
                                var nome = Object.keys(objeto)[0];

                                if (nome === name) {
                                    if (client.db.produtos.get(`${nome}.embedconfig.cupom`) == true) {
                                        var produto = objeto[nome];

                                        cupomaplicatotal = cupomaplicatotal + produto.pricetotal
                                        break;
                                    }
                                }
                            }


                        }
                    }
                } else {
                    for (var i = 0; i < nomes.length; i++) {
                        var nome = nomes[i];
                        var p = client.db.produtos.get(`${nome}.embedconfig.cupom`)
                        if (p == true) {
                            nomespossui22.push(nome)

                        }
                    }
                }

                if (nomespossui22 !== 0) {
                    for (let pds = 0; pds < nomespossui22.length; pds++) {
                        const ele = nomespossui22[pds];
                        var bbbbbbbb = client.db.produtos.get(`${ele}`);
                        if (bbbbbbbb.embedconfig.cupom == true) {
                            nomespossui23.push(ele)
                        }
                    }

                    for (let i = 0; i < nomespossui23.length; i++) {
                        const name = nomespossui23[i];

                        for (var i2 = 0; i2 < carr2.length; i2++) {
                            var objeto = carr2[i2];
                            var nome = Object.keys(objeto)[0];

                            if (nome === name) {
                                if (client.db.produtos.get(`${nome}.embedconfig.cupom`) == true) {
                                    var produto = objeto[nome];

                                    cupomaplicatotal = cupomaplicatotal + produto.pricetotal
                                    break;
                                }
                            }
                        }
                    }
                }
                if (cupomaplicatotal == 0) interaction.channel.send({ content: `${obterEmoji(22)} | Nenhum dos produtos estão ativados para receber CUPOM!!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                var un = client.db.Carrinho.get(interaction.channel.topic)
                var u = un.messagem
                var totalll = Number(un.totalpicecar).toFixed(2)

                var resultado = (Number(cupomaplicatotal) * ppp.porcentagem) / 100;
                var kk = Number(cupomaplicatotal).toFixed(2)
                var kkk = Number(resultado).toFixed(2)

                var novoValorAPagar = totalll - kkk

                if (novoValorAPagar <= 0) return interaction.channel.send({ content: `${obterEmoji(22)} | Valor de sua compra não pode se menor de 0`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })


                client.db.Carrinho.set(`${interaction.channel.topic}.totalpicecar`, totalll - kkk)


                string = u.replace(/\n${obterEmoji(14)} \*\*| Valor a Pagar:\*\* `.*`\n${obterEmoji(16)} \*\*| Cupom adicionado:\*\* `.*`/g, '');
                string = string.replace(/\n${obterEmoji(14)} \*\*| Valor a Pagar:\*\* `.*`\n${obterEmoji(16)} \*\*| Cupom adicionado:\*\* `.*`/g, '');

                string = string.replace(/^\|.*$/gm, '');


                string += `${obterEmoji(14)} **| Valor a Pagar:** \`R$${Number(novoValorAPagar).toFixed(2)}\`\n`;
                string += `${obterEmoji(6)} **| Valor do desconto aplicado:** \`R$ ${kkk} - ${ppp.porcentagem}%\`\n`
                string += `${obterEmoji(16)} **| Cupom adicionado:** \`${Cupom22}\``;

                let string2 = string.replace(/${obterEmoji(2)} \*\*\| Produtos no Carrinho:\*\* \`2\`(\|+)/g, `${obterEmoji(2)} **| Produtos no Carrinho:** \`2\``);
                string2 = string2.replace(/🎁 \*\*.*\n/g, '\n');

                client.db.Carrinho.set(`${interaction.channel.topic}.cupomaplicado`, Cupom22)
                client.db.Carrinho.set(`${interaction.channel.topic}.valordodesconto`, kkk)
                client.db.Cupom.set(`${Cupom22}.quantidade`, client.db.Cupom.get(`${Cupom22}.quantidade`) - 1)

                let vv = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)
                let field = []
                let produtostotal = 0
                let somaPricetotal = 0

                let porcentagem = Number(client.db.Carrinho.get(`${interaction.channel.topic}.valordodesconto`))

                for (let i = 0; i < vv.length; i++) {
                    produtostotal = produtostotal + 1
                    const objeto = vv[i];

                    const propriedade = Object.keys(objeto)[0]

                    const pricetotal = objeto[propriedade].pricetotal
                    const price = objeto[propriedade].price
                    const name = objeto[propriedade].name
                    const qtd2 = objeto[propriedade].qtd

                    somaPricetotal = parseFloat(somaPricetotal) + parseFloat(pricetotal);

                    let porcento = ppp.porcentagem / 100

                    field.push({
                        name: `Produto: ${name}`,
                        value: `- Valor: \`${Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n- Quantidade: \`${qtd2}\`\n- Soma Total: \`${Number((price * qtd2)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\``,
                        inline: true
                    })
                }

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `${interaction.user.username} | Resumo da Compra`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(field)

                embed.addFields(
                    { name: `Detalhes Pagamento`, value: `- Produtos Adicionados: \`${vv.length}\`\n- Valor a Pagar: **De:** \~\~\`${Number(somaPricetotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\~\~ **Por:** \`${Number(somaPricetotal - porcentagem).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n- Cupom: \`${client.db.Carrinho.get(`${interaction.channel.topic}.cupomaplicado`)} | ${ppp.porcentagem}% OFF\``, inline: false },
                )


                interaction.deferUpdate()
                interaction.message.edit({ embeds: [embed] }).then(msg => {
                    createCollector(msg)
                })
            }

            if (interaction.customId === 'escolherqtdproduto') {
                let qtdddd = interaction.fields.getTextInputValue('escolherqtdproduto');
                qtdddd = Number(qtdddd);


                if(processing[interaction.channel.id] == true) return
                
                if (isNaN(qtdddd) || !Number.isInteger(qtdddd) || qtdddd <= 1) {
                    return interaction.reply({
                        content: `${obterEmoji(21)} | Quantidade inválida! Deve ser um número inteiro maior que 1.`,
                        ephemeral: true
                    }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete();
                            } catch (error) {
                                console.error(error);
                            }
                        }, 3000);
                    });
                }




                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)


                const nomeObjetoProcurado = h.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                var ggggg = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
                var uuuuu = client.db.produtos.get(`${h.ID}.settings.estoque`)
                if (qtdddd > Object.keys(uuuuu).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, qtdddd)


                var gggggf = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)

                var pricee = ggggg.price * gggggf.qtd
                client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)




                let produto = client.db.produtos.get(`${h.ID}`)
                let estoqueproduto = client.db.produtos.get(`${h.ID}.settings.estoque`)
                let valorapagar = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos.${posicao}.${h.ID}.pricetotal`)
                let novoquantidade = gggggf.qtd

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                    )

                if (produto.settings.desc != 'Não configurado ainda...') {
                    embed.addFields(
                        { name: `Descrição`, value: `${produto.settings.desc}`, inline: false }
                    )
                }


                interaction.message.edit({ embeds: [embed] })
                interaction.deferUpdate()
            }
        }


        if (interaction.isButton()) {

            // CRIAR PAGAMENTO AQUI

            if (interaction.customId.startsWith('generatepagamentlastfase')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = client.db.Carrinho.get(interaction.channel.topic)


                var sss = ''
                var sss2 = ''
                gg.produtos.forEach((objeto, index) => {
                    const chave = Object.keys(objeto)[0];
                    const { name, qtd } = objeto[chave];
                    sss += `${name} x${qtd}`;
                    if (index !== gg.produtos.length - 1) {
                        sss += '\n';
                    }

                    sss2 += `${name} - ${qtd}, `;
                });

                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento`, sss)
                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento2`, sss2)

                if (client.db.General.get(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`) == "ON") {

                    const embed = new EmbedBuilder()
                        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setTitle(`${client.user.username} | Sistema de pagamento`)
                        .setDescription(`- Informações de pagamento abaixo.`)
                        .setFields(
                            { name: `Produto: `, value: `\`${sss}\``, inline: true },
                            { name: `Valor: `, value: `\`R$ ${Number(gg.totalpicecar).toFixed(2)}\``, inline: true },
                            { name: `Forma de Pagamento: `, value: `\`Pix - SemiAutomatico\``, inline: true }
                        )
                        .setFooter({ text: `Após efetuar o pagamento, mande o comprovante, e aguarde a verificação.` })

                    let qrcode = client.db.General.get(`ConfigGeral.SemiAutoConfig.qrcode`)
                    if (qrcode != "") {
                        if (qrcode.includes('http') || qrcode.includes('https') || qrcode.includes('.png') || qrcode.includes('.jpg') || qrcode.includes('.jpeg')) {
                            embed.setImage(qrcode)
                        }
                    }

                    const row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId("manualpix")
                            .setLabel('Chave Pix')
                            .setEmoji(`1233188452330373142`)
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("AprovarManual")
                            .setLabel('Aprovar Compra')
                            .setEmoji(`1237122935437656114`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel(`Cancelar Compra`)
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                            .setDisabled(false))

                    const uu2 = generateCode2(7)
                    var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                    let logmessage5 = ''

                    for (let i = 0; i < t.length; i++) {
                        for (let key in t[i]) {

                            var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                            logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                        }
                    }

                    const embed2 = new EmbedBuilder()
                        .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                        .setColor('Yellow')
                        .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                        .setFields(
                            { name: `Detalhes:`, value: logmessage5 },
                            { name: `ID do Pedido`, value: `\`${uu2}\`` },
                            { name: `Forma de Pagamento`, value: `\`Pix - SemiAutomatico\`` }
                        )
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTimestamp()

                    let msglog
                    try {
                        const channel = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                        msglog = await channel.send({ embeds: [embed2] })
                    } catch (error) {
                    }

                    client.db.StatusCompras.set(interaction.channel.id, { type: `SemiAutomatico`, canal: msglog.channel?.id, msg: msglog?.id, uu2: uu2 })

                    interaction.message.edit({ embeds: [embed], components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                } else {

                    const content = `Selecione uma forma de pagamento.`

                    var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                    var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`1242917506247692491`)
                                .setStyle(2)
                                .setDisabled(bb),
                            new ButtonBuilder()
                                .setCustomId("checkoutsiteeee")
                                .setLabel('Pagar no Site')
                                .setEmoji(`1233188498287104030`)
                                .setStyle(2)
                                .setDisabled(u),
                            new ButtonBuilder()
                                .setCustomId("stopcompracancellastfase")
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false))

                    interaction.message.edit({ content: content, embeds: [], components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                }
            }

            if (interaction.customId.startsWith('manualpix')) {
                interaction.channel.permissionOverwrites.edit(interaction.member, { SendMessages: true, AttachFiles: true })

                try {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Chave Pix`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: `${obterEmoji(11)} **| Tipo de Chave:**`, value: `${client.db.General.get(`ConfigGeral.SemiAutoConfig.typepix`)}` },
                            { name: `${obterEmoji(18)} **| Chave Pix:**`, value: `${client.db.General.get(`ConfigGeral.SemiAutoConfig.pix`)}` }
                        )
                        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    await interaction.reply({ ephemeral: true, embeds: [embed] })

                } catch (error) {
                    await interaction.reply({ content: `${obterEmoji(21)} | Não Disponível!`, ephemeral: true })
                }
            }

            if (interaction.customId.startsWith('manualqr')) {
                interaction.channel.permissionOverwrites.edit(interaction.member, { SendMessages: true })
                try {
                    const embed = new EmbedBuilder()

                        .setImage(client.db.General.get(`ConfigGeral.SemiAutoConfig.qrcode`))

                    await interaction.reply({ embeds: [embed] })

                } catch (error) {
                    await interaction.reply({ content: `${obterEmoji(21)} | Não Disponível!`, ephemeral: true })
                }
            }

            if (interaction.customId.startsWith('AprovarManual')) {

                let config = {
                    method: 'GET',
                    headers: {
                        'Authorization': 'SUASENHA'
                    }
                };
                const ddddd = require('../../dono.json')
                if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })            

                if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });

                const resultado = interaction.channel.topic.replace('carrinho_', '');

                var gg = client.db.Carrinho.get(interaction.channel.topic)
                const today = new Date();

                let info2 = client.db.StatusCompras.get(interaction.channel.id)

                var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                let logmessage5 = ''

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                    }
                }

                const canal = await client.channels.fetch(info2.canal)
                const msg = await canal.messages.fetch(info2.msg)

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${resultado}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${info2.uu2}\``, inline: false },
                        { name: `Forma de Pagamento`, value: `\`Pix - SemiAutomatico\``, inline: false }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                const row222 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ReembolsarCompra')
                            .setLabel('Reembolsar')
                            .setEmoji('1243421135673229362')
                            .setStyle(2)
                    );

                let msglog = await msg.reply({ embeds: [embed], components: [row222] })
                await client.db.StatusCompras.delete(interaction.channel.id)

                let uu2 = info2.uu2
                await client.db.StatusCompras.set(`${info2.uu2}`, { Status: 'Aprovado', user: resultado, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, IdCompra: info2.uu2, Metodo: 'Saldo', Data: today, canal: msglog.channel.id, msg: msglog.id })

                if (gg.messagepagamento !== null) {
                    client.db.StatusCompras.set(`${uu2}.messageinfoprodutos`, gg.messagepagamento)
                }

                if (gg.cupomaplicado !== null && gg.cupomaplicado !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.cupomaplicado`, gg.cupomaplicado)
                }
                if (gg.valordodesconto !== null && gg.valordodesconto !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.valordodesconto`, gg.valordodesconto)
                }
                await interaction.channel.messages.fetch().then(async (messages) => {
                    // await interaction.channel.bulkDelete(messages)
                })

                var date = new Date();
                date.setUTCHours(date.getUTCHours() + 3)
                var dataatual = date.getTime();

                client.db.usuariosinfo.set(`${resultado}.ultimacompra`, dataatual)

                EntregarProdutos(client)
            }


            if (interaction.customId.startsWith('checkoutsaldo')) {

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                var pp = client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)
                if (pp == null) pp = 0.00

                var gg = client.db.Carrinho.get(interaction.channel.topic)

                var tt = client.db.General.get('ConfigGeral')

                if (pp < Number(gg.totalpicecar)) {
                    interaction.reply({ content: `${obterEmoji(22)} | Você não tem saldo suficiente para realizar essa compra. Seu saldo: \`R$${Number(pp).toFixed(2)}\`, valor da compra: \`R$${Number(gg.totalpicecar).toFixed(2)}\``, ephemeral: true })
                    var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                    var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1233188452330373142`)
                                .setStyle(2)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`1242917506247692491`)
                                .setStyle(2)
                                .setDisabled(bb),
                            new ButtonBuilder()
                                .setCustomId("checkoutsiteeee")
                                .setLabel('Pagar no Site')
                                .setEmoji(`1233188498287104030`)
                                .setStyle(2)
                                .setDisabled(u),
                            new ButtonBuilder()
                                .setCustomId("stopcompracancellastfase")
                                .setEmoji(`1229787813046915092`)
                                .setStyle(4)
                                .setDisabled(false))
                    interaction.message.edit({ content: ``, components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                    return
                }
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de pagamento`)
                    .setDescription(`${obterEmoji(9)} - Você deseja efetuar o pagamento de ${gg.messagepagamento2} no valor de \`R$${Number(gg.totalpicecar).toFixed(2)}\` utilizando seu saldo de \`R$${Number(pp).toFixed(2)}\`?`)
                    .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de no maximo 1 minuto!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ComprarSaLDOcONFIRM")
                            .setLabel('Comprar')
                            .setEmoji(`1237122935437656114`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("voltarlastcheckout")
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false))

                interaction.message.edit({ content: ``, embeds: [embed], components: [row] }).then(msg => {
                    createCollector(msg)
                })
            }

            if (interaction.customId.startsWith('ComprarSaLDOcONFIRM')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var pp = client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)

                var gg = client.db.Carrinho.get(interaction.channel.topic)
                const uu2 = generateCode2(7)
                client.db.PagamentosSaldos.set(`${interaction.user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)) - Number(gg.totalpicecar).toFixed(2))



                const today = new Date();

                await client.db.StatusCompras.set(`${uu2}`, { Status: 'Aprovado', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, IdCompra: uu2, Metodo: 'Saldo', Data: today })
                if (gg.messagepagamento !== null) {
                    client.db.StatusCompras.set(`${uu2}.messageinfoprodutos`, gg.messagepagamento)
                }

                if (gg.cupomaplicado !== null && gg.cupomaplicado !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.cupomaplicado`, gg.cupomaplicado)
                }
                if (gg.valordodesconto !== null && gg.valordodesconto !== undefined) {
                    client.db.StatusCompras.set(`${uu2}.valordodesconto`, gg.valordodesconto)
                }
                await interaction.channel.messages.fetch().then(async (messages) => {
                    await interaction.channel.bulkDelete(messages)
                })

                var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                let logmessage5 = ''

                for (let i = 0; i < t.length; i++) {
                    for (let key in t[i]) {

                        var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                        logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                    }
                }

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `Pedido aprovado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562861584224288.webp?size=44&quality=lossless' })
                    .setColor('Green')
                    .setDescription(`Usuário <@!${resultado}> teve seu pedido aprovado`)
                    .setFields(
                        { name: `Detalhes`, value: logmessage5, inline: false },
                        { name: `ID do Pedido`, value: `\`${uu2}\``, inline: false },
                        { name: `Forma de Pagamento`, value: `\`Saldo\``, inline: false }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
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
                    const canal = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                    msglog = await canal.send({ embeds: [embed], components: [row222] })
                    await client.db.StatusCompras.set(`${uu2}.canal`, msglog.channel.id)
                    await client.db.StatusCompras.set(`${uu2}.msg`, msglog.id)
                } catch (error) { }

                interaction.channel.send(`${interaction.user}, estamos verificando seu pagamento. Aguarde.`)
                EntregarProdutos(client)
            }

            if (interaction.customId.startsWith('voltarlastcheckout')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = client.db.Carrinho.get(interaction.channel.topic)
                var sss = ''
                var sss2 = ''
                gg.produtos.forEach((objeto, index) => {
                    const chave = Object.keys(objeto)[0];
                    const { name, qtd } = objeto[chave];
                    sss += `${name} x${qtd}`;
                    if (index !== gg.produtos.length - 1) {
                        sss += '\n';
                    }

                    sss2 += `${name} - ${qtd}, `;
                });


                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento`, sss)
                client.db.Carrinho.set(`${interaction.channel.topic}.messagepagamento2`, sss2)

                const content = `Selecione uma forma de pagamento.`

                var u = client.db.General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                var bb = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("checkoultpix")
                            .setLabel('Pix')
                            .setEmoji(`1233188452330373142`)
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("checkoutsaldo")
                            .setLabel('Saldo')
                            .setEmoji(`1242917506247692491`)
                            .setStyle(2)
                            .setDisabled(bb),
                        new ButtonBuilder()
                            .setCustomId("checkoutsiteeee")
                            .setLabel('Pagar no Site')
                            .setEmoji(`1233188498287104030`)
                            .setStyle(2)
                            .setDisabled(u),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                            .setDisabled(false))

                interaction.message.edit({ content: content, embeds: [], components: [row] }).then(msg => {
                    createCollector(msg)
                })
            }



            if (interaction.customId.startsWith('checkoutsiteeee')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = client.db.Carrinho.get(interaction.channel.topic)

                var tt = client.db.General.get('ConfigGeral')

                let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000

                let timestamp = Math.floor(forFormat / 1000)
                mercadopago.configurations.setAccessToken(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
                const ID = `PAYMENTEE${generateCode(35)}`
                var preference = {
                    items: [
                        {
                            title: `Pagamento - ${interaction.user.username}`,
                            unit_price: Number(gg.totalpicecar),
                            quantity: 1,
                        },
                    ],
                    external_reference: ID
                };
                var ttttttt = generateCode(7)
                mercadopago.preferences
                    .create(preference)
                    .then(async function (data) {


                        client.db.Pagamentos.set(`${interaction.channel.topic}`, {
                            Type: 'site',
                            PaymentId: ID,
                            ID: ttttttt,
                            BodyCompra: data.body.id,
                            link: data.body.init_point,
                            IdServer: client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP,
                            IdServer2: interaction.guild.id,
                            user: interaction.user.id,
                            CanalID: interaction.channel.id,
                        })

                        var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                        let logmessage5 = ''

                        for (let i = 0; i < t.length; i++) {
                            for (let key in t[i]) {

                                var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                                logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                            }
                        }

                        const embed2 = new EmbedBuilder()
                            .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                            .setColor('Yellow')
                            .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                            .setFields(
                                { name: `Detalhes:`, value: logmessage5 },
                                { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                                { name: `Forma de Pagamento`, value: `\`Site - Mercado Pago\`` }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()

                        let msglog
                        try {
                            const channel = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                            msglog = await channel.send({ embeds: [embed2] })
                        } catch (error) {
                        }

                        client.db.StatusCompras.set(`${data.body.id}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, canal: msglog.channel.id, msg: msglog.id })


                        const embed = new EmbedBuilder()
                            .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${client.user.username} | Sistema de pagamento`)
                            .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\`\n${obterEmoji(12)} **| Produto(s):**\n${gg.messagepagamento}\n${obterEmoji(14)} **| Valor:**\nR$${Number(gg.totalpicecar).toFixed(2)}\n${obterEmoji(7)} **| Pagamento expira em:**\n<t:${timestamp}> (<t:${timestamp}:R>)`)
                            .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de 15 segundos`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('Realizar o Pagamento')
                                    .setEmoji(`1233188498287104030`)
                                    .setURL(data.body.init_point)
                                    .setStyle(5)
                                    .setDisabled(false),
                                new ButtonBuilder()
                                    .setCustomId("stopcompracancellastfase")
                                    .setEmoji(`1229787813046915092`)
                                    .setStyle(4)
                                    .setDisabled(false))

                        interaction.message.edit({ content: ``, embeds: [embed], components: [row] }).then(msg => {
                            setTimeout(async () => {
                                try {
                                    const resultado = interaction.channel.topic.replace('carrinho_', '');
                                    const member = await interaction.guild.members.fetch(resultado);
                                    await interaction.channel.delete()
                                    client.db.Carrinho.delete(interaction.channel.topic)
                                    client.db.Carrinho.delete(`carrinho_${resultado}`)

                                    const embed = new EmbedBuilder()
                                        .setColor("Red")
                                        .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                                        .setDescription(`O tempo para o pagamento expirou.`)
                                        .setFields(
                                            { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                                        )
                                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setTimestamp()


                                    await member.send({ embeds: [embed] })
                                } catch (error) {

                                }
                                try {
                                    const embed = new EmbedBuilder()
                                        .setColor("Red")
                                        .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                                        .setDescription(`Usuário ${interaction.user} deixou o pagamento expirar.`)
                                        .setFields(
                                            { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                                        )
                                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setTimestamp()

                                    await msglog.reply({ embeds: [embed] })
                                } catch (error) {

                                }


                            }, client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);
                        })
                    })
            }


            if (interaction.customId.startsWith('checkoultpix')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var gg = client.db.Carrinho.get(interaction.channel.topic)
                await interaction.update({ content: `Gerando pagamento...`, components: [], embeds: [] })

                console.log(gg)
                var payment_data = {
                    transaction_amount: Number(gg.totalpicecar),
                    description: `Pagamento - ${interaction.guild.name} - ${interaction.user.id}`,
                    payment_method_id: 'pix',
                    payer: {
                        email: `${interaction.user.id}@gmail.com`,
                        first_name: `Victor André`,
                        last_name: `Ricardo Almeida`,
                        identification: {
                            type: 'CPF',
                            number: '15084299872'
                        },

                        address: {
                            zip_code: '86063190',
                            street_name: 'Rua Jácomo Piccinin',
                            street_number: '971',
                            neighborhood: 'Pinheiros',
                            city: 'Londrina',
                            federal_unit: 'PR'
                        }
                    }
                }
                mercadopago.configurations.setAccessToken(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
                var ttttttt = generateCode2(7)
                await mercadopago.payment.create(payment_data)
                    .then(async function (data) {

                        client.db.Pagamentos.set(`${interaction.channel.topic}`, {
                            Type: 'pix',
                            BodyCompra: data.body.id,
                            IdServer: client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP,
                            user: interaction.user.id,
                            ID: ttttttt,
                            QrCode: data.body.point_of_interaction.transaction_data.qr_code_base64,
                            pixcopiaecola: data.body.point_of_interaction.transaction_data.qr_code,
                            CanalID: interaction.channel.id,
                        })

                        var tt = client.db.General.get('ConfigGeral')

                        let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000

                        let timestamp = Math.floor(forFormat / 1000)

                        var ttttt = client.db.Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)

                        const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
                        const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

                        const embed2 = new EmbedBuilder()
                            .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                            .setFields(
                                { name: `Código copia e cola`, value: `\`\`\`${client.db.Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)}\`\`\``, inline: false }
                            )
                            .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de 15 segundos`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                            .setImage(`attachment://payment.png`)


                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("pixcopiaecola182381371")
                                    .setLabel('Copia e Colar')
                                    .setEmoji(`1233200554252042260`)
                                    .setStyle(2),
                                // new ButtonBuilder()
                                //     .setCustomId("qrcode182812981")
                                //     .setLabel('QrCode')
                                //     .setEmoji(`1242663891868057692`)
                                //     .setStyle(2),
                                new ButtonBuilder()
                                    .setCustomId("stopcompracancellastfase")
                                    .setEmoji(`1229787813046915092`)
                                    .setStyle(4)
                            )

                        interaction.editReply({ content: ``, embeds: [embed2], components: [row], files: [attachment] })

                        var t = client.db.Carrinho.get(`${interaction.channel.topic}.produtos`)

                        let logmessage5 = ''

                        for (let i = 0; i < t.length; i++) {
                            for (let key in t[i]) {

                                var valor = Number(client.db.produtos.get(`${key}.settings.price`)) * Number(t[i][key].qtd)
                                logmessage5 += `\`${t[i][key].qtd}x ${client.db.produtos.get(`${key}.settings.name`)} | ${Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n`
                            }
                        }

                        const embed = new EmbedBuilder()
                            .setAuthor({ name: `Pedido solicitado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562913790595133.webp?size=44&quality=lossless' })
                            .setColor('Yellow')
                            .setDescription(`Usuário ${interaction.user} solicitou um pedido.`)
                            .setFields(
                                { name: `Detalhes:`, value: logmessage5 },
                                { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                                { name: `Forma de Pagamento`, value: `\`Pix - Mercado Pago\`` }
                            )
                            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTimestamp()

                        let msglog
                        try {
                            const channel = await client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                            msglog = await channel.send({ embeds: [embed] })
                        } catch (error) {
                        }

                        setTimeout(async () => {
                            try {
                                const resultado = interaction.channel.topic.replace('carrinho_', '');
                                const member = await interaction.guild.members.fetch(resultado);
                                await interaction.channel.delete()
                                client.db.Carrinho.delete(interaction.channel.topic)
                                client.db.Carrinho.delete(`carrinho_${resultado}`)

                                const embed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                                    .setDescription(`O tempo para o pagamento expirou.`)
                                    .setFields(
                                        { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                                    )
                                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setTimestamp()


                                await member.send({ embeds: [embed] })
                            } catch (error) {

                            }
                            try {
                                const embed = new EmbedBuilder()
                                    .setColor("Red")
                                    .setAuthor({ name: `Pagamento expirado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                                    .setDescription(`Usuário ${interaction.user} deixou o pagamento expirar.`)
                                    .setFields(
                                        { name: `ID do Pedido`, value: `\`${data.body.id}\`` },
                                    )
                                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setTimestamp()

                                await msglog.reply({ embeds: [embed] })
                            } catch (error) {

                            }
                        }, client.db.General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);
                        client.db.StatusCompras.set(`${data.body.id}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, canal: msglog.channel.id, msg: msglog.id, type: 'pix' })
                    })
            }

            if (interaction.customId.startsWith('pixcopiaecola182381371')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                interaction.reply({ content: `${client.db.Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)}`, ephemeral: true })
            }
            if (interaction.customId.startsWith('qrcode182812981')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                await interaction.reply({ content: `${obterEmoji(10)} Gerando QRCode...`, ephemeral: true })
                var ttttt = client.db.Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)
                if (
                    ttttt == null
                ) return interaction.editReply({ content: `QR Code invalido, crie outro carrinho.`, ephemeral: true })
                const { qrGenerator } = require("../../Lib/QRCodeLib");
                const qr = new qrGenerator({ imagePath: './Lib/aaaaa.png' })

                const qrcode = await qr.generate(ttttt)


                const buffer = Buffer.from(qrcode.response, "base64");
                const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

                interaction.editReply({ files: [attachment], ephemeral: true, content: `` })
            }


            if (interaction.customId.startsWith('verificarpagamento172371293')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                verificarpagamento(client)
            }


            if (interaction.customId.startsWith('termos-continuar')) {

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate();
                
                var vv = client.db.Carrinho.get(interaction.channel.topic).produtos;
                
                if (vv.length === 0) return interaction.reply({ content: `❌ | Você não pode prosseguir sem nenhum produto no carrinho`, ephemeral: true });
                processing[interaction.channel.id] = true
                const allMessages = await interaction.channel.messages.fetch({ limit: 100 });
                const messagesToDelete = allMessages.filter(msg => msg.id !== interaction.message.id);
                await interaction.channel.bulkDelete(messagesToDelete, true).catch();
                interaction.deferUpdate();

                
                let somaPricetotal = 0;
                let produtostotal = 0;
                let mensagem = '';
                let field = [];
                
                // Collect all promises for message deletions
                const deletePromises = vv.map(async objeto => {
                    produtostotal++;
                    const propriedade = Object.keys(objeto)[0];
                    const { ChannelID, MessageID, pricetotal, price, name, qtd } = objeto[propriedade];
                
                    // const canal = client.channels.cache.get(ChannelID);
                    // if (canal) {
                    //     const message = await canal.messages.fetch(MessageID).catch(console.error);
                    //     if (message) await message.delete().catch(console.error);
                    // }
                
                    somaPricetotal += parseFloat(pricetotal);
                
                    mensagem += `${obterEmoji(28)} | Produto: \`${name}\`\n`;
                    mensagem += `${obterEmoji(14)} | Valor unitário: \`R$${Number(price).toFixed(2)}\`\n`;
                    mensagem += `${obterEmoji(12)} | Quantidade: \`${qtd}\`\n`;
                    mensagem += `${obterEmoji(14)} | Total: \`R$${Number(price * qtd).toFixed(2)}\`\n\n`;
                
                    field.push({
                        name: `Produto: ${name}`,
                        value: `- Valor: \`${Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n- Quantidade: \`${qtd}\`\n- Soma Total: \`${Number(price * qtd).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\``,
                        inline: true
                    });
                });
                
                // Wait for all message deletions to complete
                await Promise.all(deletePromises);
                
                mensagem += `\n${obterEmoji(12)} **| Produtos no Carrinho:** \`${produtostotal}\`\n`;
                mensagem += `${obterEmoji(14)} **| Valor a Pagar:** \`R$${somaPricetotal.toFixed(2)}\`\n`;
                mensagem += `${obterEmoji(16)} **| Cupom adicionado:** \`Sem Cupom\`\n`;
                
                client.db.Carrinho.set(`${interaction.channel.topic}.totalpicecar`, somaPricetotal.toFixed(2));
                client.db.Carrinho.set(`${interaction.channel.topic}.messagem`, mensagem);
                client.db.Carrinho.set(`${interaction.channel.topic}.accepttermo`, true);
                
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) === '#635b44' ? 'Green' : client.db.General.get(`ConfigGeral.ColorEmbed`))
                    .setAuthor({ name: `${interaction.user.username} | Resumo da Compra`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(field)
                    .addFields({
                        name: `Detalhes Pagamento`,
                        value: `- Produtos Adicionados: \`${produtostotal}\`\n- Valor a Pagar: \`${somaPricetotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n- Cupom: \`Sem Cupom Adicionado\``,
                        inline: false
                    });
                
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("generatepagamentlastfase")
                            .setLabel('Ir para o Pagamento')
                            .setEmoji(`1237122935437656114`)
                            .setStyle(3),
                        new ButtonBuilder()
                            .setCustomId("addcupomcarlast")
                            .setLabel('Cupom')
                            .setEmoji(`1234653175617687704`)
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar')
                            .setEmoji(`1229787813046915092`)
                            .setStyle(4)
                    );
                
                interaction.message.edit({ embeds: [embed], components: [row], content: `${interaction.user}` }).then(msg => {
                    createCollector(msg);
                });
                
            }
            if (interaction.customId.startsWith('stopcompracancellastfase')) {
              //  const resultado = interaction.channel.topic.replace('carrinho_', '');

                let info = client.db.StatusCompras.get(interaction.channel.id)
                client.db.Carrinho.delete(interaction.channel.topic)
                client.db.Carrinho.delete(`carrinho_${interaction.user.id}`)


                if (info == null) {
                    interaction.channel.delete()
                    return
                }

                let uu2 = info.uu2
                let type
                if (info.type == "SemiAutomatico") {
                    type = "\`Pix - SemiAutomatico\`"
                } else {
                    type = "\`Pix - Mercado Pago\`"
                }

                const embed2 = new EmbedBuilder()
                    .setAuthor({ name: `Pedido Cancelado`, iconURL: 'https://cdn.discordapp.com/emojis/1230562893372854374.webp?size=44&quality=lossless' })
                    .setColor('Red')
                    .setDescription(`Usuário ${interaction.user} cancelou seu pedido.`)
                    .setFields(
                        { name: `ID do Pedido`, value: `\`${uu2}\`` },
                        { name: `Forma de Pagamento`, value: `${type}` }
                    )
                    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()

                try {
                    const canal = await client.channels.fetch(info.canal)
                    const msg = await canal.messages.fetch(info.msg)
                    await msg.reply({ embeds: [embed2] })
                } catch (error) {
                }

                interaction.channel.delete()
            }

            if (interaction.customId.startsWith('addcupomcarlast')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                const modala = new ModalBuilder()
                    .setCustomId('addcupomcarlast')
                    .setTitle(`Adicionar Cupom`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('addcupomcarlast')
                    .setLabel("NOME DO CUPOM?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                await interaction.showModal(modala);
            }

            if (interaction.customId.startsWith('escolherqtdproduto')) {

                // COLOCAR DELAY AQUI

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                const modala = new ModalBuilder()
                    .setCustomId('escolherqtdproduto')
                    .setTitle(`✏ | Alterar Quantidade`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('escolherqtdproduto')
                    .setLabel("Quantidade?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                await interaction.showModal(modala);
            }


            if (interaction.customId.startsWith('removerprodutocarrinho')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)

                // quero remover o produto com o nome h.ID

                const nomeObjetoProcurado = h.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                if (posicao === -1) return interaction.reply({ content: `${obterEmoji(22)} | Produto não encontrado!`, ephemeral: true })

                const objetoRemovido = t.produtos.splice(posicao, 1)[0];

                client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos`, t.produtos)

                interaction.message.delete()
            }

            // if (interaction.customId.startsWith('aaa')) {
            //     const resultado = interaction.channel.topic.replace('carrinho_', '');
            //     if (resultado !== interaction.user.id) return interaction.deferUpdate()
            //     var uuu = db.table('infoseditproductocarrinho')
            //     var h = await uuu.get(interaction.message.id)

            //     const nomeObjetoProcurado = h.ID
            //     const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
            //     let posicao = -1;

            //     for (let i = 0; i < t.produtos.length; i++) {
            //         const objeto = t.produtos[i];
            //         if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
            //             posicao = i;
            //             break;
            //         }
            //     }

            //     var ggggg = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
            //     var uuuuu = client.db.produtos.get(`${h.ID}.settings.estoque`)
            //     if (ggggg.qtd <= 1) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível diminuir mais que o produto mínimo!`, ephemeral: true })
            //     interaction.deferUpdate()
            //     client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`) - 1)



            //     var gggggf = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)

            //     var pricee = ggggg.price * gggggf.qtd
            //     client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)

            //     let produto = client.db.produtos.get(`${h.ID}`)

            //     const embed = new EmbedBuilder()
            //         .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
            //         .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
            //         .setFields(
            //             { name: `Detalhes`, value: `- Quantidade: \`${ggggg.qtd}\`\n- Valor: \`R$ ${Number(produto.settings.price).toFixed(2)}\`\n- Restam: \`${Object.keys(uuuuu).length}\``, inline: false }
            //         )
            //     if (produto.settings.desc != 'Não configurado ainda...') {
            //         embed.addFields(
            //             { name: `Descrição`, value: `${produto.settings.desc}`, inline: false }
            //         )
            //     }

            //     interaction.message.edit({ embeds: [embed] })
            // }

            if (interaction.customId.startsWith('termos-ler')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Termos de compra`)
                    .setDescription(client.db.General.get(`ConfigGeral.TermosCompra`))

                interaction.reply({ embeds: [embed], ephemeral: true })
            }



            if (interaction.customId.startsWith('remqtdproducto')) {
                const userid = interaction.channel.topic.replace('carrinho_', '');
                if (userid !== interaction.user.id) return interaction.deferUpdate()

                if(processing[interaction.channel.id] == true) return
                let infocarrinho = db.table('infoseditproductocarrinho')
                let info = await infocarrinho.get(interaction.message.id)

                const nomeObjetoProcurado = info.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                let Informacaoproduto = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}`)
                if (Informacaoproduto.qtd <= 1) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível diminuir mais que o produto mínimo!`, ephemeral: true })
                interaction.deferUpdate()

                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`, Informacaoproduto.qtd - 1)
                let produto = client.db.produtos.get(`${info.ID}`)
                let pricee = Informacaoproduto.price * (Informacaoproduto.qtd - 1)
                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`, pricee)

                let novoquantidade = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`)
                let estoqueproduto = client.db.produtos.get(`${info.ID}.settings.estoque`)
                let valorapagar = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`)

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                    )

                if (produto.settings.desc != 'Não configurado ainda...') {
                    embed.addFields(
                        { name: `Descrição`, value: `${produto.settings.desc}`, inline: false }
                    )
                }

                interaction.message.edit({ embeds: [embed] })
            }
            if (interaction.customId.startsWith('addqtdproducto')) {
                const userid = interaction.channel.topic.replace('carrinho_', '');
                if (userid !== interaction.user.id) return interaction.deferUpdate()

                    if(processing[interaction.channel.id] == true) return

                let infocarrinho = db.table('infoseditproductocarrinho')
                let info = await infocarrinho.get(interaction.message.id)

                const nomeObjetoProcurado = info.ID
                const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                let Informacaoproduto = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}`)
                let estoqueproduto = client.db.produtos.get(`${info.ID}.settings.estoque`)
                if (Informacaoproduto.qtd >= Object.keys(estoqueproduto).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true })
                interaction.deferUpdate()

                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`, Informacaoproduto.qtd + 1)
                let produto = client.db.produtos.get(`${info.ID}`)
                let pricee = Informacaoproduto.price * (Informacaoproduto.qtd + 1)
                await client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`, pricee)

                let novoquantidade = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.qtd`)
                let valorapagar = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${info.ID}.pricetotal`)

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                    )

                if (produto.settings.desc != 'Não configurado ainda...') {
                    embed.addFields(
                        { name: `Descrição`, value: `${produto.settings.desc}`, inline: false }
                    )
                }

                interaction.message.edit({ embeds: [embed] })
            }
            // if (interaction.customId.startsWith('aaw')) {
            //     const resultado = interaction.channel.topic.replace('carrinho_', '');
            //     if (resultado !== interaction.user.id) return interaction.deferUpdate()
            //     var uuu = db.table('infoseditproductocarrinho')
            //     var h = await uuu.get(interaction.message.id)
            //     const nomeObjetoProcurado = h.ID
            //     const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
            //     let posicao = -1;

            //     for (let i = 0; i < t.produtos.length; i++) {
            //         const objeto = t.produtos[i];
            //         if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
            //             posicao = i;
            //             break;
            //         }
            //     }
            //     var ggggg = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
            //     var uuuuu = client.db.produtos.get(`${h.ID}.settings.estoque`)
            //     if (ggggg.qtd >= Object.keys(uuuuu).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true })
            //     interaction.deferUpdate()

            //     client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`) + 1)
            //     var gggggf = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
            //     var pricee = ggggg.price * gggggf.qtd
            //     client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)

            //     let produto = await client.db.produtos.get(`${h.ID}`)

            //     const embed = new EmbedBuilder()
            //         .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
            //         .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
            //         .setFields(
            //             { name: `Detalhes`, value: `- Quantidade: \`${ggggg.qtd}\`\n- Valor: \`R$ ${Number(produto.settings.price).toFixed(2)}\`\n- Restam: \`${Object.keys(uuuuu).length}\``, inline: false }
            //         )
            //     if (produto.settings.desc != 'Não configurado ainda...') {
            //         embed.addFields(
            //             { name: `Descrição`, value: `${produto.settings.desc}`, inline: false }
            //         )
            //     }

            //     interaction.message.edit({ embeds: [embed] })
            // }
            if (interaction.customId.startsWith('activeNotificacaoProduto')) {
                var aa = await uu.get(interaction.user.id)


                var tt = client.db.produtos.get(`${aa}.settings.notify`)
                if (tt !== null) {
                    if (tt.includes(interaction.user.id)) {
                        interaction.reply({
                            content: `${obterEmoji(8)} | Você já estava com as notificações ativadas, portanto elas foram desativadas.\n**Caso queira ativar só clicar no botão novamente!**`, ephemeral: true
                        })
                        var novaArray = tt.filter(function (elemento) {
                            return elemento !== interaction.user.id;
                        });

                        client.db.produtos.set(`${aa}.settings.notify`, novaArray)

                    } else {
                        interaction.reply({ content: `${obterEmoji(8)} | Notificações ativadas com sucesso!`, ephemeral: true })
                        client.db.produtos.push(`${aa}.settings.notify`, interaction.user.id)
                    }
                } else {
                    interaction.reply({ content: `${obterEmoji(8)} | Notificações ativadas com sucesso!`, ephemeral: true })
                    client.db.produtos.push(`${aa}.settings.notify`, interaction.user.id)
                }
            }

        }
        var g = null
        var namecustom = null
        var painel2222 = null
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'buyprodutoporselect') {
                g = client.db.produtos.get(interaction.values[0])
                namecustom = interaction.values[0]
                painel2222 = true
                painelname = interaction.customId
            }
        }
        if (interaction.isButton()) {
            g = client.db.produtos.get(interaction.customId)
            namecustom = interaction.customId
            painel2222 = false
        }
        if (g !== null) {
            interaction.message.edit()
            const currentTime = Date.now();
            const customId = interaction.user.id;

            const ddawdawdd = client.db.blacklist.get(`BlackList.users`)

            if (ddawdawdd !== null) {
                if (ddawdawdd.includes(interaction.user.id) == true) {
                    interaction.reply({ content: `❌ | Você está registrado na **BLACK-LIST** de nosso sistema de LOJA!`, ephemeral: true })
                    return
                }
            }


            if (lastReturnTimes[customId]) {
                const elapsedTime = currentTime - lastReturnTimes[customId];
                const remainingTime = Math.max(0, cooldownTime - Math.floor(elapsedTime / 1000));

                if (remainingTime > 0) {
                    interaction.reply({ content: `Aguarde ${remainingTime} segundos para interagir novamente.`, ephemeral: true });
                    return;
                }
            }
            const axios = require('axios');
            lastReturnTimes[customId] = currentTime;

            if (client.db.General.get('ConfigGeral').MercadoPagoConfig.PixToggle == "ON") {
                const embed3 = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de Vendas`)
                    .setDescription(`${obterEmoji(21)} | ${interaction.user} Você não configurou corretamente o Token do Mercado Pago!.`)

                if (client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP == "") return interaction.reply({ embeds: [embed3], ephemeral: true })


            }


            if(interaction.guild.id == '1241239036786511954'){
                const hasRole = interaction.member.roles.cache.has('1254925075489099816');

                if (!hasRole) {

                    const rowaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://discord.com/oauth2/authorize?client_id=1236110068076904478&redirect_uri=https://restorecord.com/api/callback&response_type=code&scope=identify+guilds.join+email&state=1241239036786511954`) //1246648781097664604
                            .setLabel('Se Verificar')
                            .setEmoji(`<:3e1b4a8abeac4ef48e72eb55bcace054:1254944625593159813>`)
                            .setStyle(5)
                            .setDisabled(false))

                        return interaction.reply({ephemeral: true, components: [rowaa],content: `- Antes de realizar um pedido em nosso servidor, você deve se verificar.\n- Para se verificar, clique no botão abaixo!`})



                }

            }


         



            let config = {
                method: 'GET',
                headers: {
                    'Authorization': 'SUASENHA'
                }
            };
            // const ddddd = await fetch(`http://apivendas.squareweb.app/api/v1/BlackListReembolso`, config)
            // const info = await ddddd.json()
            // const ggg = info.users
            // if (ggg.includes(interaction.user.id)) return interaction.reply({ components: [rowaa], content: `❌ | Você se encontra na BlackList por realizar um reembolso em algum servidor que utiliza BOT da Promisse Solutions!`, ephemeral: true })



            const embed4 = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`${client.user.username} | Sistema de Vendas`)
                .setDescription(`${obterEmoji(21)} | ${interaction.user}, o dono do bot ainda não configurou os canais, aguarde até ele configurar!`)


            if (client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) == null) return interaction.reply({ embeds: [embed4], ephemeral: true })
            if (client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) == null) return interaction.reply({ embeds: [embed4], ephemeral: true })

            const embed2 = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`${client.user.username} | Sistema de Vendas`)
                .setDescription(`${obterEmoji(21)} | ${interaction.user} O sistema de vendas se encontra desativado, aguarde até ele ser ligado novamente!`)


            if (client.db.General.get(`ConfigGeral.Status`) == 'OFF') return interaction.reply({ embeds: [embed2], ephemeral: true })



            var fasasas = client.db.produtos.get(`${namecustom}.settings.CargosBuy`)

            if (fasasas !== null) {
                const hasAnyRole = fasasas.some(roleId => interaction.member.roles.cache.has(roleId))
                if (hasAnyRole) {
                } else {
                    const embedakdkjasd = new EmbedBuilder()
                        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setTitle(`${client.user.username} | Sistema de Vendas`)
                        .setDescription(`${obterEmoji(22)} | ${interaction.user} Você não possui permissão para comprar esse produto`)

                    interaction.reply({ embeds: [embedakdkjasd], ephemeral: true })
                    return
                }
            }



            var f = client.db.produtos.get(`${namecustom}.settings.estoque`)

            const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                .setDescription(`${obterEmoji(21)} | Este produto está sem estoque, aguarde um reabastecimento!`)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("activeNotificacaoProduto")
                        .setLabel('Ativar Notificações')
                        .setEmoji(`1243307533158842521`)
                        .setStyle(2)
                )

            if (f !== null) {
                if (Object.keys(f).length <= 0) return interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).then(msg => {
                    uu.set(interaction.user.id, namecustom)
                })
            } else {
                return interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).then(msg => {
                    uu.set(interaction.user.id, namecustom)
                })
            }






            let achando = interaction.guild.channels.cache.find(a => a.topic === `carrinho_${interaction.user.id}`);

            var a = client.db.Carrinho.get(`carrinho_${interaction.user.id}.ChannelUrl`)



            if (a !== null) {


                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`Ver Carrinho`)
                        .setStyle(5)
                        .setURL(a)
                )
                if (achando) {

                    var uuuu = client.db.Carrinho.get(`carrinho_${interaction.user.id}.accepttermo`)

                    const row99 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`Ver Carrinho`)
                            .setStyle(5)
                            .setURL(a)
                    )
                    if (uuuu == true) return interaction.reply({ content: `${obterEmoji(21)} | Não é possível adicionar mais produtos no seu carrinho!`, components: [row99], ephemeral: true })


                    var all = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                    var bbbb = client.db.Carrinho.get(`carrinho_${interaction.user.id}.produtos`)
                    const objetoEncontrado = bbbb.find(objeto => {
                        return objeto.hasOwnProperty(g.ID);
                        // Ou utilize: return palavra in objeto;
                    });
                    if (objetoEncontrado) {
                        interaction.reply({ content: `Esse produto ja foi adicionado ao seu carrinho.`, components: [row2], ephemeral: true })
                        return
                    }


                    const content = `Produto adicionado com sucesso no seu carrinho!`

                    const row3 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`Ver Carrinho`)
                            .setStyle(5)
                            .setURL(a)
                    )

                    interaction.reply({ content: content, embeds: [], components: [row3], ephemeral: true })
                    const channela = interaction.guild.channels.cache.get(all.ChannelID);

                    let estoqueproduto = client.db.produtos.get(`${g.ID}.settings.estoque`)
                    let valorapagar = g.settings.price
                    let novoquantidade = 1
                    let produto = client.db.produtos.get(`${g.ID}`)

                    const embed = new EmbedBuilder()
                        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setAuthor({ name: `Produto: ${produto.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                        .setFields(
                            { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(produto.settings.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Estoque: \`${Object.keys(estoqueproduto).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(valorapagar).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Quantidade: \`${novoquantidade}\``, inline: false }
                        )


                    if (produto.settings.desc != 'Não configurado ainda...') {
                        embed.addFields(
                            { name: `Descrição`, value: `${produto.settings.desc}`, inline: false }
                        )
                    }

                    const row22 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setEmoji('1233110125330563104')
                            .setCustomId('addqtdproducto')
                            .setStyle(2),
                        new ButtonBuilder()
                            .setEmoji('1237122937631408128')
                            .setCustomId('escolherqtdproduto')
                            .setStyle(3),
                        new ButtonBuilder()
                            .setEmoji('1242907028079247410')
                            .setCustomId('remqtdproducto')
                            .setStyle(2),
                        new ButtonBuilder()
                            .setEmoji('1229787813046915092')
                            .setCustomId('removerprodutocarrinho')
                            .setStyle(4)
                    )

                    channela.send({ embeds: [embed], components: [row22] }).then(msg => {
                        const produto = { [g.ID]: { price: g.settings.price, qtd: 1, name: g.settings.name, ChannelID: msg.channel.id, MessageID: msg.id, pricetotal: g.settings.price, GuildServerID: interaction.guild.id } };
                        client.db.Carrinho.push(`carrinho_${interaction.user.id}.produtos`, produto)
                        var uuu = db.table('infoseditproductocarrinho')
                        uuu.set(msg.id, { ID: g.ID, ChannelID: msg.channel.id, MessageID: msg.id })
                    })
                    return
                }
            }



            var categoria
            if (client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) !== null) {
                categoria = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)
            } else {
                categoria = null
            }

            const channel = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`));

            if (channel == undefined) return interaction.reply({ content: `❌ | Error o CHAT escolhido não é uma categoria`, ephemeral: true })

            var tttttttt = channel.type == ChannelType.GuildCategory
            if (tttttttt == false) return interaction.reply({ content: `❌ | Error o CHAT escolhido não é uma categoria`, ephemeral: true })


            var uuuuuuuuuu = 1
            if (client.db.General.get('ConfigGeral').MercadoPagoConfig.PixToggle == "ON") {
                await axios.get('https://api.mercadopago.com/v1/payment_methods', {
                    headers: {
                        'Authorization': `Bearer ${client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}`
                    }
                })
                    .then(async (data) => {
                        await interaction.reply({ content: `${obterEmoji(10)} | Criando o Carrinho...`, ephemeral: true })
                    })
                    .catch(async error => {
                        await interaction.reply({ content: `❌ | Error Mercado Pago: ${error.response.data.message}`, ephemeral: true })
                        uuuuuuuuuu = 0
                    });
            } else {

                await interaction.reply({ content: `${obterEmoji(10)} | Criando o Carrinho...`, ephemeral: true })
            }
            if (uuuuuuuuuu !== 1) return

            interaction.guild.channels.create({
                name: `🛒・${interaction.user.username}`,
                parent: categoria,
                topic: `carrinho_${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            }).then(async channel281243664 => {

                var g = client.db.produtos.get(namecustom)
                var f = client.db.produtos.get(`${namecustom}.settings.estoque`)
                var pp = g.ID
                client.db.Carrinho.delete(`carrinho_${interaction.user.id}`)
                const produto = { [pp]: { price: g.settings.price, qtd: 1, name: g.settings.name, pricetotal: g.settings.price } };
                if (painel2222 == true) {
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}`, { ChannelUrl: channel281243664.url, ChannelID: channel281243664.id, produtos: [produto], GuildServerID: interaction.guild.id, painel: painel2222, painelname: painelname })
                } else {
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}`, { ChannelUrl: channel281243664.url, ChannelID: channel281243664.id, produtos: [produto], GuildServerID: interaction.guild.id, painel: painel2222 })
                }
                const embedPrincipalCar = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} | Carrinho de Compras`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`- Olá ${interaction.user}, bem vindo ao seu carrinho! Aqui você poderá adicionar produtos e finalizar sua compra.\n- Lembre-se de ler nossos termos e compra, para não ter nenhum problema futuramente, ao continuar com a compra, você concorda com nossos termos.\n- Quando estiver tudo pronto aperte o botão abaixo, para continuar com sua compra!`)

                const RowPrincipalCar = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Aceitar e Continuar')
                        .setEmoji('1237122935437656114')
                        .setCustomId('termos-continuar')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setLabel('Cancelar')
                        .setEmoji('1229787813046915092')
                        .setCustomId('stopcompracancellastfase')
                        .setStyle(4),
                    new ButtonBuilder()
                        .setLabel('Ler os Termos')
                        .setEmoji('1234606184711979178')
                        .setCustomId('termos-ler')
                        .setDisabled(client.db.General.get(`ConfigGeral.TermosCompra`) == 'Não definido' ? true : false)
                        .setStyle(1)
                )
                channel281243664.send({ content: `${interaction.user}`, embeds: [embedPrincipalCar], components: [RowPrincipalCar] }).then(msg => {
                    createCollector(msg)
                })


                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Green' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setAuthor({ name: `Produto: ${g.settings.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1230562855447826473.webp?size=44&quality=lossless' })
                    .setFields(
                        { name: `Detalhes`, value: `- Produto:\n - Valor Unitário: \`${Number(g.settings.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Estoque: \`${Object.keys(f).length}\`\n- Pagamento:\n - Valor a pagar: \`${Number(g.settings.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\`\n - Quantidade: \`1\``, inline: false }
                    )

                if (g.settings.desc != 'Não configurado ainda...') {
                    embed.addFields(
                        { name: `Descrição`, value: `${g.settings.desc}`, inline: false }
                    )
                }

                // .setFields(
                //     { name: `${obterEmoji(28)} | Produto`, value: `\`${g.settings.name}\``, inline: false },
                //     { name: `${obterEmoji(12)} | Quantidade`, value: `\`1\``, inline: false },
                //     { name: `${obterEmoji(14)} | Preço`, value: `\`R$ ${Number(g.settings.price).toFixed(2)}\``, inline: false },
                //     { name: `${obterEmoji(19)} | Restam:`, value: `\`${Object.keys(f).length}\``, inline: false }
                // )

                const row22 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setEmoji('1233110125330563104')
                        .setCustomId('addqtdproducto')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setEmoji('1237122937631408128')
                        .setCustomId('escolherqtdproduto')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setEmoji('1242907028079247410')
                        .setCustomId('remqtdproducto')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setEmoji('1229787813046915092')
                        .setCustomId('removerprodutocarrinho')
                        .setStyle(4)
                )

                channel281243664.send({ embeds: [embed], components: [row22] }).then(msg => {
                    const nomeObjetoProcurado = g.ID
                    const t = client.db.Carrinho.get(`carrinho_${interaction.user.id}`)
                    let posicao = -1;

                    for (let i = 0; i < t.produtos.length; i++) {
                        const objeto = t.produtos[i];
                        if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                            posicao = i;
                            break;
                        }
                    }
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${g.ID}.ChannelID`, msg.channel.id)
                    client.db.Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${g.ID}.MessageID`, msg.id)
                    var uuu = db.table('infoseditproductocarrinho')
                    uuu.set(msg.id, { ID: g.ID, ChannelID: msg.channel.id, MessageID: msg.id, GuildServerID: interaction.guild.id })
                })


                const reply = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Sistema de Vendas`)
                    .setDescription(`**✅ | ${interaction.user} Seu carrinho foi aberto com sucesso em: ${channel281243664}, fique à vontade para adicionar mais produtos.**`)
                    .setColor('Green')

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`Ver Carrinho`)
                        .setStyle(5)
                        .setURL(channel281243664.url)
                )

                interaction.editReply({ content: `Olá ${interaction.user}, Seu carrinho está aberto! Sinta-se à vontade para adicionar mais produtos.`, embeds: [], components: [row] })
            })
        } else {
            return
        }
    }
}

function generateCode(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}
function generateCode2(length) {
    let characters = '1234567890';
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}