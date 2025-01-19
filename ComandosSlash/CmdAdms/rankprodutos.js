const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { rankprosdutos } = require("../../FunctionsAll/Criados");

module.exports = {
  name: "rankprodutos",
  description: "[🛠|Moderação] vejam os produtos que mais geraram lucros.",
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
 

    rankprosdutos(interaction)

  }
}