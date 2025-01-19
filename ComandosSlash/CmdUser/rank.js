const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const mercadopago = require("mercadopago");
const { rank } = require("../../FunctionsAll/Criados");
module.exports = {
  name: "rank",
  description: '[🛠|💰 Vendas Moderação] Veja o rank das pessoas que mais compraram',
  type: Discord.ApplicationCommandType.ChatInput,
  

  run: async (client, interaction, message) => {
    let valor = interaction.options.getUser('user');
    
    var usu = null
    if (valor == null) {
      usu = interaction.user.id
    } else {
      usu = valor.id
    }

    rank(interaction, client)

  }
}