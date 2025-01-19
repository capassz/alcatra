
const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, DiscordAPIError } = require('discord.js');
const { obterEmoji } = require('../Handler/EmojiFunctions');

const { QuickDB } = require("quick.db");
const db = new QuickDB();
const mercadopago = require("mercadopago")
const { Discord, AttachmentBuilder } = require("discord.js")
const axios = require("axios")


function AdicionarSaldo(interaction, client, user, qtd) {

    if (qtd <= 0) return interaction.reply({ content: `ERROR: Você não pode adicionar um VALOR NEGATIVO ou ZERO em seu saldo.` })

    if (client.db.General.get('ConfigGeral').SaldoConfig.ValorMinimo > qtd) return interaction.reply({ content: `ERROR: Está função foi definida para ter um VALOR MÍNIMO de ${client.db.General.get('ConfigGeral').SaldoConfig.ValorMinimo}`, ephemeral: true })

    interaction.reply({ content: `${obterEmoji(10)} | Gerando pagamento...`, ephemeral: true})

    setTimeout(async () => {

        const bonus = client.db.General.get('ConfigGeral').SaldoConfig.Bonus
        var saldoComBonus = Number(qtd) + (Number(qtd) * Number(bonus) / 100);
        if (bonus == 0) saldoComBonus = 0

        var totalvalor = Number(qtd) + (qtd * bonus / 100)
        if (bonus == 0) totalvalor = Number(qtd)

        var tt = client.db.General.get('ConfigGeral')

        let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000

        let timestamp = Math.floor(forFormat / 1000)

        const embed = new EmbedBuilder()
            .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: `${interaction.user.username} | Adicionar Saldo`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setDescription(`- Realize o pagamento para adicionar saldo em sua conta.`)
            .setFields(
                { name: `${obterEmoji(4)} | Valor:`, value: `R$ ${Number(qtd).toFixed(2)}`, inline: true },
                { name: `${obterEmoji(6)} | Bônus de depósito:`, value: `${client.db.General.get('ConfigGeral').SaldoConfig.Bonus}% - R$ ${Number(saldoComBonus).toFixed(2)}`, inline: true },
                { name: `${obterEmoji(7)} | Pagamento expira em:`, value: `<t:${timestamp}> (<t:${timestamp}:R>)`, inline: true }
            )
            // .setDescription(`\`\`\`Pague com pix Para receber seu Saldo.\`\`\`\n${obterEmoji(4)} **| Valor:**\n${"R$ " + Number(qtd).toFixed(2)}\n${obterEmoji(6)} | Bônus de depósito:\n${client.db.General.get('ConfigGeral').SaldoConfig.Bonus}% - ${"R$ " + Number(saldoComBonus).toFixed(2)}\n${obterEmoji(7)} | Pagamento expira em: \n<t:${timestamp}> (<t:${timestamp}:R>)`)
            .setFooter({ text: `Após efetuar o pagamento, o tempo do saldo chegar na sua conta em até 1 minuto!`, iconURL: `${client.user.displayAvatarURL()}` })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("pixcopiaecolasaldo")
                    .setLabel('Pix Copia e Cola')
                    .setEmoji(`1233188452330373142`)
                    .setStyle(1)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId("qrcodesaldo")
                    .setLabel('Qr Code')
                    .setEmoji(`1242663891868057692`)
                    .setStyle(1)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId("deletemessageal")
                    .setEmoji(`1229787813046915092`)
                    .setStyle(4)
                    .setDisabled(false),)

        await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true, content: `` }).then(async msg => {
            generatePagament(interaction, Number(qtd), totalvalor, client)
            setTimeout(() => {
                return interaction.editReply({ content: `**${obterEmoji(7)} | O Tempo para fazer o pagamento acabou!**`, embeds: [], components: [], ephemeral: true }).catch(() => { return })
            }, 60000 * 5)
        })
    }, 1000);
}

function generatePagament(interaction, qtd, totalvalor, client) {

    var u = Number(qtd).toFixed(2)
    mercadopago.configurations.setAccessToken(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
    var payment_data = {
        transaction_amount: Number(u),
        description: `Adicionar Saldo - ${interaction.guild.name} - ${interaction.user.id}`,
        payment_method_id: 'pix',
        payer: {
            email: 'japanstorepayments@gmail.com',
            first_name: 'Homero',
            last_name: 'Brum',
            identification: {
                type: 'CPF',
                number: '09111189770'
            }
        }

    };
    mercadopago.configurations.setAccessToken(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP)
    mercadopago.payment.create(payment_data).then(function (data) {
        const pix = data.body.point_of_interaction.transaction_data.qr_code;
        const qr = data.body.point_of_interaction.transaction_data.qr_code_base64;
        var nn = db.table('pag')
        nn.set(interaction.user.id, {pix: pix, qr: qr})
        ChecarPagamentoAdicionarsaldo(data.body.id, interaction, Number(qtd).toFixed(2), Number(totalvalor).toFixed(2))
    })
}

async function getqrcode(interaction, user) {
    var nn = db.table('pag')
    var a = await nn.get(interaction.user.id)
    var qr1 = Buffer.from(a.qr, "base64");
    const attachment = new AttachmentBuilder(qr1, { name: 'payment.png' });

    interaction.reply({files: [attachment], ephemeral: true})
}

async function CopiaECola(interaction, user) {
    var nn = db.table('pag')
    var a = await nn.get(interaction.user.id)
    interaction.reply({content: a.pix, ephemeral: true})
}



function ChecarPagamentoAdicionarsaldo(id, interaction, price, price2 , client) {
    var meuInterval = setInterval(async () => {
        var res = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                Authorization: `Bearer ${client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}`
            }
        })
        if (res.data.status == 'approved') { // approved ou approved
            var u = client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)
            clearInterval(meuInterval);
            client.db.PagamentosSaldos.add(`${interaction.user.id}.SaldoAccount`, Number(price2))
            client.db.PagamentosSaldos.push(`${interaction.user.id}.IDCompras`, { ID: id, Valor: Number(price2) })
            var h = Number(price2)
            

            try {
              const channela = await interaction.guild.channels.cache.get(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

            } catch (error) {
                
            }
            


            interaction.editReply({
               files: [],  content: `${obterEmoji(8)} | Pagamento aprovado, você tinha R$ ${Number(u).toFixed(2)}, foi adicionado R$ ${Number(h).toFixed(2)} e agora você está com R$ ${client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`).toFixed(2)}.\n${obterEmoji(9)} | Id do Pagamento: ${id}`, embeds: [], components: []
            })
        }
    }, 1000 * 5);
    setTimeout(async () => {
        if (meuInterval) {
            clearInterval(meuInterval);
            try {
                await interaction.editReply({ content: `**${obterEmoji(7)} | O Tempo para fazer o pagamento acabou!**`, embeds: [], components: [], ephemeral: true }).catch(() => { return })
            } catch (error) {

            }
        }
    }, 60000 * 5);
}

module.exports = {
    AdicionarSaldo,
    getqrcode,
    CopiaECola,
    ChecarPagamentoAdicionarsaldo
};