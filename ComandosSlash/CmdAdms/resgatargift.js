const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "resgatargift",
  description: "[💰| Vendas Utilidades] Resgate um gift",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "codigo",
      description: "Coloque sua Key aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    let key = interaction.options.getString('codigo');
    var keyverify = await client.db.giftcards.get(key)
    if (keyverify == null) return interaction.reply({ content: `${obterEmoji(7)} | você tentou resgatar um gift inexistente`, ephemeral: true })

    client.db.PagamentosSaldos.set(`${interaction.user.id}.SaldoAccount`, Number(client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)) + Number(keyverify.valor))
    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`Gift resgatado com sucesso.`)
      .setDescription(`Você acabou de resgatar um gift no valor de: \`R$${Number(keyverify.valor).toFixed(2)}\` , agora você está com \`R$${Number(client.db.PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)).toFixed(2)}\``)
      .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
      .setTimestamp()


    interaction.reply({ embeds: [embed], ephemeral: true })
    client.db.giftcards.delete(key)

    const log = interaction.guild.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
    try {
      const embed01 = new Discord.EmbedBuilder()
        .setDescription(`O ${interaction.user} acabou de resgatar um gift.`)
        .addFields(
          { name: `${obterEmoji(11)} | Gift:`, value: `${key}` },
          { name: `${obterEmoji(6)} | Valor do Gift:`, value: `\`R$${Number(keyverify.valor).toFixed(2)}\`` }
        )
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

      await log.send({ embeds: [embed01] })
    } catch (error) {

    }

  }
}
