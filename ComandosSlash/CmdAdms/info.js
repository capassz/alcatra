const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { obterEmoji } = require("../../Handler/EmojiFunctions");



module.exports = {
  name: "info",
  description: '[🧀|💰 Vendas Utilidades] Mostra informações da compra que você colocou o ID',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "ID da compra que deseja verificar",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {

     let config = {
      method: 'GET',
      headers: {
        'Authorization': 'SUASENHA'
      }
    };
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 


    let valor = interaction.options.getString('id');

    var tt = client.db.StatusCompras.get(valor)

    if (tt == null) return interaction.reply({ content: `${obterEmoji(7)} | Compra não encontrada!` })
    
    const timestamp = Date.parse(tt.Data);
    let timestamp2 = Math.floor(timestamp / 1000)



    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)

      .setTitle(`${obterEmoji(7)} | Mostrando a compra de Id: ${valor}`)
      .addFields(
        { name: `${obterEmoji(13)} **| Compra Feita Por:**`, value: `<@${tt.user}> **- ${tt.user}**` },
        { name: `${obterEmoji(12)} **| Produto(s) Comprado(s):**`, value: `\`${tt.messageinfoprodutos}\`` },
        { name: `${obterEmoji(14)} **| Valor Pago:**`, value: `\`R$${Number(tt.valortotal).toFixed(2)}\`` },
        { name: `${obterEmoji(15)} **| Método de Pagamento:**`, value: `\`${obterEmoji(18)} | ${tt.Metodo}\`` },
        { name: `${obterEmoji(2)} **| Cupom:**`, value: `${tt.cupomaplicado == undefined ? '\`NENHUM CUPOM USADO!\`' : `\`${tt.cupomaplicado}\``}` },
        { name: `${obterEmoji(16)} **| Desconto:**`, value: `R$${tt.valordodesconto == undefined ? '0' : `${tt.valordodesconto}`}` },
        { name: `${obterEmoji(17)} **| Data da Compra:**`, value: `**<t:${timestamp2}> (<t:${timestamp2}:R>)**` },
      )

    interaction.reply({ embeds: [embed] })
  }
}