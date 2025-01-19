const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { obterEmoji } = require("../../Handler/EmojiFunctions");


module.exports = {
  name: "pegar",
  description: '[🧀|💰 Vendas Utilidades] Mostra o Produto que foi Entregue da compra que você colocou o ID',
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


    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`${obterEmoji(7)} | Mostrando a compra de Id: ${valor}`)
      .setDescription(`${obterEmoji(13)} **| Compra Feita Por:**\n<@${tt.user}> **- ${tt.user}**\n\n${obterEmoji(12)} **| Produto(s) Comprado(s):**\n\`${tt.messageinfoprodutos}\`\n\n${obterEmoji(14)} **| Valor Pago:**\n\`R$${Number(tt.valortotal).toFixed(2)}\`\n\n**${obterEmoji(33)} | Produto(s) Entregue(s):**\n\`${tt.produtosentregue}\``)

    interaction.user.send({ embeds: [embed] })

    interaction.reply({content: `${obterEmoji(8)} | Verifique o seu privado`, ephemeraL: true})
  }
}