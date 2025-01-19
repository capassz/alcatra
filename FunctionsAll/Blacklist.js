const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");


const axios = require('axios');
const { obterEmoji } = require("../Handler/EmojiFunctions");

async function VarreduraBlackList(client) {
    const fff = client.db.StatusCompras.fetchAll()


    try {
        const embed3 = new EmbedBuilder()
        .setColor('#2b2d31')
            .setAuthor({ name: `Sistema Anti-Fraude`, iconURL: `https://cdn.discordapp.com/emojis/1230562927032012860.webp?size=44&quality=lossless` })
            .setDescription(`Seu BOT está realizando uma varredura nos pagamentos para verificar a existência de quaisquer reembolsos suspeitos.`)
            .setTimestamp()


        const row222 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('asSs')
                    .setLabel('Mensagem do Sistema')
                    .setStyle(2)
                    .setDisabled(true)
            );


        const channel = await client.channels.fetch(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`))
        await channel.send({ components: [row222], embeds: [embed3] })
    } catch (error) {

    }



    try {
        var res = await axios.get(`https://api.mercadopago.com/v1/payments/search`, {
            headers: {
                Authorization: `Bearer ${client.db.General.get('ConfigGeral.MercadoPagoConfig.TokenAcessMP')}`
            },
            params: {
                status: 'refunded', // Filtrar por pagamentos com status de reembolsados
                limit: 1000 // Limitar o número de resultados (opcional)
            }
        });

        res.data.results.forEach(async pagamento => {
            if (pagamento.refunds[0].source.type == 'admin') {

                let dddd = client.db.blacklistAll.get(`bloqueados.id`) || []
                if (!dddd.includes(pagamento.id)) {
                    client.db.blacklistAll.push(`bloqueados.id`, pagamento.id)
                     let config = {
                        method: 'POST',
                        headers: {
                            'Authorization': 'SUASENHA',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: pagamento.point_of_interaction.transaction_data.bank_info.payer.long_name,
                            price: pagamento.transaction_amount,
                            pagamentoid: pagamento.id
                        })
                    };
                    let ddd = await fetch('https://dev.promisse.app/blacklist/push', config)
                }
            }

        });


    } catch (error) {
      //  console.log(error)
    }
}




function automsg(interaction, client) {

    const ggg = client.db.General.get(`ConfigGeral.AutoMessage`);

    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username} | Painel Mensagem Automáticas`, iconURL: `${client.user.displayAvatarURL()}` })

    var desc = ''
    if (ggg !== null) {
        for (let index = 0; index < ggg.length; index++) {
            const element = ggg[index];

            const truncatedDescricao = element[0].descricao.length > 30 ? element[0].descricao.substring(0, 30) + '...' : element[0].descricao;
            desc += `( \`${index + 1}\` ) - ${truncatedDescricao}\n`

        }
    }

    if (desc == '') {
        desc = `- Nenhuma mensagem automática cadastrada.`
    }

    embed.setDescription(desc)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("criarmsgauto")
                .setLabel('Criar Mensagem Automática')
                .setEmoji(`1233110125330563104`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("remmsgautomatica")
                .setLabel('Remover Mensagem Automática')
                .setEmoji(`1229787813046915092`)
                .setStyle(4),
            new ButtonBuilder()
                .setCustomId("returnacoesautomaticas")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )



    interaction.message.edit({ embeds: [embed], components: [row2] })
}


module.exports = {
    VarreduraBlackList, automsg
}