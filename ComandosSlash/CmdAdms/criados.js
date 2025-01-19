const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { CriadosStart } = require("../../FunctionsAll/Criados");

module.exports = {
  name: "criados",
  description: "[🛠| Vendas Moderação] Veja todos os ptodutos, cupons, keys, etc. cadastrados no bot.",
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
 

    CriadosStart(interaction,client)
  }
}