const Discord = require("discord.js");
const { StartPersonalizarMessage } = require("../../FunctionsAll/Personalizar");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('per2mis2sionsm2essa2ge2')

module.exports = {
  name: "resetar",
  description: '[🛠 | 💰 Vendas Moderação] resete as vendas, o rank, cupons, etc.',
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
 

    const editEmbed = {
      content: `⚠️ | Use o Comando Novamente!`,
      components: [],
      embeds: []
    };

    const editMessage = async (message) => {
      try {
        await message.edit(editEmbed)
      } catch (error) {

      }

    };

    const createCollector = (message) => {
      const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
      });

      collector.on('collect', () => {
        collector.stop();
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {

          editMessage(message);

        }
      });
    };

    // StartPersonalizarMessage(interaction, client, interaction.user.id)
    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setTitle(`${client.user.username} | Sistema de Vendas`)
      .setDescription(`Clique no que você deseja resetar:`)
      .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("resetperfilestatisticas")
          .setLabel('Estatísticas e Perfil')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("ResetRankCompradores")
          .setLabel('Rank Compradores')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("ResetRankProdutos")
          .setLabel('Rank Produtos')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("ResetCupons")
          .setLabel('Cupons')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("ResetGiftCards")
          .setLabel('GiftCards')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),)
    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("ResetKeys")
          .setLabel('Keys')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("ResetDrops")
          .setLabel('Drops')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("ResetProdutos")
          .setLabel('Produtos e Paineis')
          .setEmoji(`1237122940617883750`)
          .setStyle(1)
          .setDisabled(false),)

    interaction.reply({ embeds: [embed], components: [row, row2] }).then(async u => {
      const messages = await interaction.channel.messages.fetch({ limit: 1 });
      const lastMessage = messages.first();
      uu.set(lastMessage.id, interaction.user.id)
      createCollector(u)
    })
  }
}