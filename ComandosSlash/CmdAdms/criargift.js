const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");


module.exports = {
  name: "criargift",
  description: "[💰| Vendas Moderação] Cria uma giftcard no valor escolhido",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor para ser Resgatado",
      type: Discord.ApplicationCommandOptionType.Number,
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
 
    let cargo = interaction.options.getNumber('valor');
    let qtd = interaction.options.getNumber('qtd');

    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`Gift criado com sucesso.`)
      .setDescription(`Olhe a DM para ver o código do gift.`)
      .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
      .setTimestamp()

    let keys = []

    for (let iii = 0; iii < qtd; iii++) {

      var keya = key(23)

      client.db.giftcards.set(keya, { valor: cargo })

      keys.push(keya)
    }

    


    let txt = keys.join('\n')
    let buffer = Buffer.from(txt, 'utf-8')

    const embed2 = new EmbedBuilder()
      .setAuthor({ name: `${client.user.username} | Gerador de Gift`, iconURL: interaction.user.displayAvatarURL() })
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setDescription(`- Foram criadas \`${keys.length}\` gifts e enviadas no TXT abaixo.`)

    interaction.user.send({ embeds: [embed2], files: [{ attachment: buffer, name: 'Gifts.txt' }] })
    interaction.reply({ embeds: [embed], ephemeral: true })
  }

}
function key(n) {
  const randomizar = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
  let text = ''
  for (var i = 0; i < n + 1; i++) text += randomizar.charAt(Math.floor(Math.random() * randomizar.length))
  return text;
}