const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, ButtonBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { obterEmoji } = require("../../Handler/EmojiFunctions");


module.exports = {
  name: "dm",
  description: '[🛠 | Moderação] Envie uma mensagem no privado de um usuário.',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'usuário',
      description: 'Mencione um usuário.',
      type: Discord.ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'mensagem',
      description: 'Envie algo para ser enviado.',
      type: Discord.ApplicationCommandOptionType.String,
      required: true
    }
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
 

    const member = interaction.options.getUser('usuário')
    const msg = interaction.options.getString('mensagem')

    const channela = client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

    try {

       channela.send({content: `O usuário ${interaction.user} enviu uma mensagem para o membro ${member} atráves do comando /dm com a seguinte mensagem \n\n${msg}`})
    } catch (error) {
      
    }

    try {
      
     member.send({ content: `${msg}` })
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${obterEmoji(8)} | mensagem enviada com sucesso no privado do usuário ${member}.`)
            .setColor('Green')
        ], ephemeral: true
      })
    } catch (error) {
      return interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription(`Olá ${interaction.user}, a mensagem não foi enviada para ${member}, pois o usuário está com a DM fechada!`)
            .setColor('Red')
        ],ephemeral: true
      })
    }
  }
}