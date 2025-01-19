const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, ButtonBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { obterEmoji } = require("../../Handler/EmojiFunctions");


module.exports = {
  name: "delkey",
  description: '[🛠|💰 Vendas Moderação] Deletar uma key',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Coloque a key aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 

    let key = interaction.options.getString('key');

    var uu = client.db.Keys.get(key)

    if(uu == null) return interaction.reply({content: `${obterEmoji(8)} | o produto \`${key}\` foi deletado do servidor.`, ephemeral: true})

    interaction.reply({content: `${obterEmoji(8)} | o produto \`${key}\` foi deletado do servidor.`, ephemeral: true})
    client.db.Keys.delete(key)
  }
}