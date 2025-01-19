const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "ativarkey",
  description: "[💰| Vendas Utilidades] Ative uma key",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Coloque sua Key aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    let key = interaction.options.getString('key');
    var keyverify = client.db.Keys.get(key)
    if(keyverify == null) return interaction.reply({content: `${obterEmoji(7)} | você tentou ativar uma key inexistente`, ephemeral: true})
    
    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`Key ativada com sucesso.`)
        .setDescription(`Você acabou de ativar a key para o cargo <@&${keyverify.cargo}>, aproveite!`)
        .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

        try {
          await interaction.member.roles.add(keyverify.cargo)
          interaction.reply({embeds: [embed]})
          client.db.Keys.delete(key)
        } catch (error) {
          interaction.reply({ephemeral: true,content: `ERROR: Eu não possui permissão para te setar este cargo avise um STAFF.`})
        }
        const log = interaction.guild.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
        try {
          const embed01 = new Discord.EmbedBuilder()
            .setDescription(`O ${interaction.user} acabou de ativar uma KEY.`)
            .addFields(
              { name: `${obterEmoji(11)} | Key:`, value: `${key}` },
              { name: `${obterEmoji(7)} | Cargo ativado:`, value: `<@&${keyverify.cargo}> \`${keyverify.cargo}\`` }
            )
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    
          await log.send({ embeds: [embed01] })
        } catch (error) {
    
        }
  }
}
