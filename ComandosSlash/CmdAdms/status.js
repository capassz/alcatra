const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "status",
  description: '[🛠|💰 Vendas Moderação] Veja o status de um pagamento',
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

    if (tt == null) return interaction.reply({ content: `${obterEmoji(7)} | Compra não encontrada!`, ephemeral: true  })


    interaction.reply({ content: `${obterEmoji(24)} | Status: ${tt.Status}\n${obterEmoji(25)} | Valor: R$${Number(tt.valortotal).toFixed(2)}`, ephemeral: true })
  }
}