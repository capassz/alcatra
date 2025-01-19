const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "criardrop",
  description: "[💰| Vendas Moderação] Crie um drop",
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
 

    const modal = new Discord.ModalBuilder()
      .setCustomId('criar-drop-modal')
      .setTitle(`Criar um Drop`)

    const pergunta01 = new Discord.TextInputBuilder()
      .setCustomId('codigo-drop')
      .setLabel('Codigo:')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('Insira o Código deste drop.')
      .setRequired(true)

    const pergunta02 = new Discord.TextInputBuilder()
      .setCustomId('premio-drop')
      .setLabel('O que será entregue?')
      .setPlaceholder(`Coloque aqui o que o usuário irá receber quando resgatar este drop.`)
      .setMaxLength(500)
      .setStyle(Discord.TextInputStyle.Paragraph)
      .setRequired(true)

    const p1 = new ActionRowBuilder().addComponents(pergunta01)
    const p2 = new ActionRowBuilder().addComponents(pergunta02)

    modal.addComponents(p1, p2)

    await interaction.showModal(modal);
  }
}