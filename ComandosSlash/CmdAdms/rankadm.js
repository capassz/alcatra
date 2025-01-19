const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { rank, rankadm } = require("../../FunctionsAll/Criados");

module.exports = {
  name: "rankadm",
  description: '[🛠|💰 Vendas Moderação] Veja o rank das pessoas que mais compraram',
  type: Discord.ApplicationCommandType.ChatInput,
  

  run: async (client, interaction, message) => {
     let config = {
      method: 'GET',
      headers: {
        'Authorization': 'SUASENHA'
      }
    };
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 

    rankadm(interaction, client)
  }
}