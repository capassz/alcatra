const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('painelsettings')

function createpainel(interaction, client, painelid, produto) {
    if (client.db.PainelVendas.get(painelid) !== null) return interaction.reply({ content: `${obterEmoji(7)} | Já esxiste um painel com esse id, use /config_painel \`${painelid}\`, para configura-lo` })

    const embed = new EmbedBuilder()
        .setTitle(`Não configurado ainda...`)
        .setDescription(`Não configurado ainda...`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (client.db.General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
        embed.setThumbnail(client.db.General.get(`ConfigGeral.MiniaturaEmbeds`))
    }
    if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
        embed.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
    }

    var tt = client.db.produtos.get(`${produto}`)
    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('buyprodutoporselect')
                .setPlaceholder('Selecione um Produto.')
                .addOptions([
                    {
                        label: `${tt.settings.name}`,
                        description: `💸 | Valor: ${Number(tt.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(tt.settings.estoque).length}`,
                        emoji: `${obterEmoji(2)}`,
                        value: `${produto}`,
                    },
                ])
        )

    interaction.channel.send({ embeds: [embed], components: [style2row] }).then(msg => {
        client.db.PainelVendas.set(painelid, {
            ID: painelid, produtos: [produto], ChannelID: msg.channel.id, MessageID: msg.id, settings: {
                title: 'Não configurado ainda...',
                desc: 'Não configurado ainda...'
            }
        })

    })



    interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Painel criado com sucesso!, use **/config_painel** \`${painelid}\` Para configura-lo` })
}

function configpainel(interaction, painel, client, user) {

    const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Gerenciar Painel`)
        .setDescription(`Escolha oque deseja gerenciar:`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configembedpainel")
                .setLabel('Configurar Embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("configprodutospainel")
                .setLabel('Configurar Produtos')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
        )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("atualizarmensagempainel")
            .setLabel('Atualizar Painel')
            .setEmoji(`1238978383845654619`)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("deletarpainel")
            .setLabel('Deletar')
            .setEmoji(`1229787813046915092`)
            .setStyle(4)
    )

    if (interaction.message == undefined) {
        interaction.reply({ components: [row, row2], embeds: [embed] }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();

            uu.set(lastMessage.id, { user: user, painel: painel })
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {

        })
    }
}


async function configembedpainel(interaction, client) {
    var t = await uu.get(interaction.message.id)


    const embed = new EmbedBuilder()

        .setTitle(`Tíltulo Atual: ${client.db.PainelVendas.get(`${t.painel}.settings.title`)}`)
        .setDescription(`${obterEmoji(19)} **| Descrição Atual:**\n${client.db.PainelVendas.get(`${t.painel}.settings.desc`)}\n\n🎨 | Cor da Embed: ${client.db.PainelVendas.get(`${t.painel}.settings.color`) == null ? '#000000' : client.db.PainelVendas.get(`${t.painel}.settings.color`)}\n📒 | Texto do Place Holder: ${client.db.PainelVendas.get(`${t.painel}.settings.placeholder`) == null ? 'Selecione um Produto' : client.db.PainelVendas.get(`${t.painel}.settings.placeholder`)}\n📂 | Banner: ${client.db.PainelVendas.get(`${t.painel}.settings.banner`) == null ? 'Painel Sem Banner.' : `[Banner](${client.db.PainelVendas.get(`${t.painel}.settings.banner`)})`}\n🖼️ | Miniatura: ${client.db.PainelVendas.get(`${t.painel}.settings.miniatura`) == null ? 'Painel Sem Miniatura.' : `[Miniatura](${client.db.PainelVendas.get(`${t.painel}.settings.miniatura`)})`}`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setFooter({ text: `Rodapé Atual: ${client.db.PainelVendas.get(`${t.painel}.settings.rodape`) == null ? 'Sem Rodapé' : client.db.PainelVendas.get(`${t.painel}.settings.rodape`)}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpainelembed")
                .setLabel('Título da embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpaineldesc")
                .setLabel('Descrição da embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelrodape")
                .setLabel('Rodapé da embed')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelplaceholder")
                .setLabel('Place Holder')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelcolor")
                .setLabel('Cor Embed')
                .setEmoji(`1233129471922540544`)
                .setStyle(2)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpainelBanner")
                .setLabel('Banner')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("editpainelMiniatura")
                .setLabel('Miniatura')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel")
                .setLabel('Atualizar Painel')
                .setEmoji(`1238978383845654619`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("uay89efg7t9a7wa87dawgbydaid76")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ embeds: [embed], components: [row, row2] })
}




async function configprodutospainel(interaction, client) {
    var t = await uu.get(interaction.message.id)


    var tt = client.db.PainelVendas.get(`${t.painel}.produtos`)

    const options = [];
    var messageeee = ''
    for (let iiii = 0; iiii < tt.length; iiii++) {
        const element = tt[iiii];
        var bb = client.db.produtos.get(`${element}`)

        messageeee += `${bb.painel == null ? `${obterEmoji(2)}` : bb.painel.emoji} | __**${iiii}°**__ - ${obterEmoji(12)} | **ID:** ${bb.ID}\n`


        const option = {
            label: `${bb.settings.name}`,
            description: `💸 | Valor: ${Number(bb.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
            emoji: `${bb.painel == null ? `${obterEmoji(2)}` : bb.painel.emoji}`,
            value: `${bb.ID}`,
        };

        options.push(option);

    }

    if (options == 0) {
        const options2 = {
            label: `Nenhum Produto Cadastrado nesse Painel!`,
            emoji: `1229787813046915092`,
            value: `nada`,
        };

        options.push(options2);
        messageeee += `Sem Produtos, adicione!`

    }


    const embed = new EmbedBuilder()
        .setTitle(`Estes são os produtos cadastrados no Painel:`)
        .setDescription(messageeee)
        .setFooter({ text: `Caso queira trocar o emoji de algum produto, selecione ele no select menu abaixo:`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addprodutopainel")
                .setLabel('Adicionar Produto')
                .setEmoji(`1233110125330563104`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("removeprodutopainel")
                .setLabel('Remover Produto')
                .setEmoji(`1242907028079247410`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("changesequenciaprodutos")
                .setLabel('Alterar Sequencia')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
        )


    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('changeemojipainelproduto')
                .setPlaceholder('Selecione um Produto para alterar o Emoji')
                .addOptions(options)
        )


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel")
                .setLabel('Atualizar Painel')
                .setEmoji(`1238978383845654619`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("uay89efg7t9a7wa87dawgbydaid76")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ embeds: [embed], components: [row, style2row, row2] })
}



async function atualizarmensagempainel(guildid, painel, client, user) {

    var tttttt = client.db.PainelVendas.get(painel)

    var ttttttttt = tttttt.produtos

    var options = []
    for (let iiii = 0; iiii < ttttttttt.length; iiii++) {
        const element = ttttttttt[iiii];
        var bb = client.db.produtos.get(`${element}`)

        const option = {
            label: `${bb.settings.name}`,
            description: `💸 | Valor: ${Number(bb.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
            emoji: `${bb.painel == null ? `${obterEmoji(2)}` : bb.painel.emoji}`,
            value: `${bb.ID}`,
        };
        options.push(option);

    }

    const dddddd = client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#000000` : client.db.General.get(`ConfigGeral.ColorEmbed`)


    const embed = new EmbedBuilder()
        .setTitle(`${tttttt.settings.title}`)
        .setDescription(`${tttttt.settings.desc}`)
        .setColor(client.db.PainelVendas.get(`${painel}.settings.color`) == null ? dddddd : client.db.PainelVendas.get(`${painel}.settings.color`))

    if (tttttt.settings.banner !== null) {
        embed.setImage(tttttt.settings.banner)
    }
    if (tttttt.settings.miniatura !== null) {
        embed.setThumbnail(tttttt.settings.miniatura)
    }
    if (tttttt.settings.rodape !== null && tttttt.settings.rodape !== undefined) {
        embed.setFooter({ text: `${tttttt.settings.rodape}` })
    }

    if (options == 0) {
        const options2 = {
            label: `Nenhum Produto Cadastrado nesse Painel!`,
            emoji: `1229787813046915092`,
            value: `nada`,
        };

        options.push(options2);

    }

    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('buyprodutoporselect')
                .setPlaceholder(`${client.db.PainelVendas.get(`${painel}.settings.placeholder`) == null ? 'Selecione um Produto' : client.db.PainelVendas.get(`${painel}.settings.placeholder`)}`)
                .addOptions(options)
        )

    try {
        const channel = await client.channels.fetch(tttttt.ChannelID)
        const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);


        if (client.user.id == '1249866472444919830' || client.user.id == '1231711607655235646') {
            let banner = tttttt.settings.banner


            if (!banner) return interaction.reply({ content: `Defina o banner do produto` })
            const attachment = new AttachmentBuilder(banner, { name: 'banner.png' });

            await fetchedMessage.edit({ content: `${tttttt.settings.desc}`, files: [attachment], components: [style2row] , embeds: []});
         
        } else {
            await fetchedMessage.edit({ embeds: [embed], components: [style2row] });
        }
    } catch (error) {
    }

}




module.exports = {
    createpainel,
    configpainel,
    configembedpainel,
    configprodutospainel,
    atualizarmensagempainel
};