const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');


module.exports = {
  name: "permlist",
  description: "[💰| Vendas Moderação] Verificar os usuários que podem utilizar seu BOT",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {

    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 
    var msg = ''
    for (let iiii = 0; iiii < ggg.length; iiii++) {
      const element = ggg[iiii];
      var member
      try {
        member = await interaction.guild.members.fetch(element);
        msg += `- 🔧 | ${member} - ${member.id}\n`
      } catch (error) {

      }


      
      
    }


    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Membro(s) com permissão - ${ggg.length}`)
          .setDescription(msg)
          .setColor('Green')
      ], ephemeral: true
    })

  }
}