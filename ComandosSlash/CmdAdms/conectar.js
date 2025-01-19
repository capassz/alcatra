const Discord = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "conectar",
  description: '[🛠 | Vendas Moderação] Faz o bot entrar em um canal de voz',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'canal',
      description: 'Coloque o canal de voz aqui!',
      type: Discord.ApplicationCommandOptionType.Channel,
      channelTypes: [2],
      required: true
    }
  ],

  run: async (client, interaction, message) => {

    interaction.reply({content: `${obterEmoji(10)} Aguarde...`, ephemeral: true})

    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })

    const canal = interaction.options.getChannel('canal')

    const connection = joinVoiceChannel({
      channelId: canal.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    })

    if (connection) {
      const embed = new Discord.EmbedBuilder()
          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription(`**${obterEmoji(8)} | ${interaction.user.username}, entrei no canal de voz: ${canal} com sucesso!**`)
          .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      
      return interaction.editReply({ content: ``, embeds: [embed], ephemeral: true })
  } else {
      const embed = new Discord.EmbedBuilder()
          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setDescription(`**${obterEmoji(22)} | ${interaction.user.username}, não foi possivel entrar no canal.**`)
          .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
 
      return interaction.editReply({ content: ``, embeds: [embed], ephemeral: true })
  }
  }
}