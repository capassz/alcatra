const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "criarkey",
  description: "[💰| Vendas Moderação] Cria uma key para o cargo selecionado",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "cargo",
      description: "Selecione um Cargo",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "qtd",
      description: "Quantidade de GIfts a serem criados",
      type: Discord.ApplicationCommandOptionType.Number,
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
 

    let cargo = interaction.options.getRole('cargo');
    let qtd = interaction.options.getNumber('qtd');
    const botMember = interaction.guild.members.cache.get(client.user.id)
    if (cargo.position > botMember.roles.highest.position) {
      interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | O cargo selecionado é superior ao meu!` })
      return
    }

    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`Chave gerada com sucesso.`)
      .setDescription(`Olhe a DM para ver a chave.`)
      .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
      .setTimestamp()

    for (let iii = 0; iii < qtd; iii++) {
      var keya = key(23)


      const embed2 = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`Chave criada!`)
        .setDescription(`Você acabou de gerar uma chave para o cargo ${cargo.name}\n**Lembre-se de deixar o cargo do bot em cima desse cargo**\n\n${obterEmoji(11)} **| Chave**\n${keya}`)
        .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

      client.db.Keys.set(keya, { cargo: cargo.id, user: interaction.user.username })
      try {
        await interaction.user.send({ embeds: [embed2] })
      } catch (error) {
      }
    }
    interaction.reply({ embeds: [embed], ephemeral: true })
  }
}
function key(n) {
  const randomizar = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
  let text = ''
  for (var i = 0; i < n + 1; i++) text += randomizar.charAt(Math.floor(Math.random() * randomizar.length))
  return text;
}