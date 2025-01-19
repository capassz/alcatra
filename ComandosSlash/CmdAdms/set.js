const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, ButtonBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "set",
  description: "[💰| Vendas Moderação] Cadastra um novo produto no bot",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja configurar!', type: 3, required: true, autocomplete: true },
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
 
    const id = interaction.options._hoistedOptions[0].value

    var s = client.db.produtos.get(`${id}.settings.estoque`)
    if (s == null) return interaction.reply({ content: `❌ | O produto selecionado não está configurado para este servidor.`, ephemeral: true })

    const embeddesc = client.db.DefaultMessages.get(`ConfigGeral`)
    var dd = client.db.produtos.get(`${id}`)

    var modifiedEmbeddesc = embeddesc.embeddesc
      .replace('#{desc}', client.db.produtos.get(`${id}.settings.desc`))
      .replace('#{preco}', Number(client.db.produtos.get(`${id}.settings.price`)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
      .replace('#{estoque}', Object.keys(s).length)
      .replace('#{nome}', client.db.produtos.get(`${id}.settings.name`))

    var modifiedEmbeddesc2 = embeddesc.embedtitle
      .replace('#{nome}', client.db.produtos.get(`${id}.settings.name`))
      .replace('#{preco}', Number(client.db.produtos.get(`${id}.settings.price`)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
      .replace('#{estoque}', Object.keys(s).length)

    const dddddd = client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#2b2d31` : client.db.General.get(`ConfigGeral.ColorEmbed`)

    const embed = new EmbedBuilder()
      .setTitle(modifiedEmbeddesc2)
      .setDescription(modifiedEmbeddesc)
      .setColor(`${dd.embedconfig.color == null ? dddddd : dd.embedconfig.color}`)

    if (dd.embedconfig.banner !== undefined) {
      embed.setImage(dd.embedconfig.banner)
    } else {

      if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
        embed.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
      }
    }


    if (dd.embedconfig.miniatura !== undefined) {
      embed.setThumbnail(dd.embedconfig.miniatura)
    } else {
      if (client.db.General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
        embed.setThumbnail(client.db.General.get(`ConfigGeral.MiniaturaEmbeds`))
      }
    }

    if (client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) !== null) {
      embed.setFooter({ text: client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) })
    }


    var color = null
    if (embeddesc.colorbutton == 'Vermelho') {
      color = 4
    } else if (embeddesc.colorbutton == 'Azul') {
      color = 1
    } else if (embeddesc.colorbutton == 'Verde') {
      color = 3
    } else if (embeddesc.colorbutton == 'Cinza') {
      color = 2
    } else {
      color = 3
    }

    const row = new ActionRowBuilder()


    if (embeddesc.emojibutton == null) {
 
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`${id}`)
          .setLabel(`${client.db.DefaultMessages.get(`ConfigGeral.textbutton`) == null ? 'Comprar' : client.db.DefaultMessages.get(`ConfigGeral.textbutton`)}`)
          .setStyle(color)
          .setEmoji('1243275863827546224')
          .setDisabled(false),
      )
    } else {
      
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`${id}`)
          .setLabel(`${client.db.DefaultMessages.get(`ConfigGeral.textbutton`) == null ? 'Comprar' : client.db.DefaultMessages.get(`ConfigGeral.textbutton`)}`)
          .setStyle(color)
          .setEmoji(client.db.DefaultMessages.get(`ConfigGeral.emojibutton`))
          .setDisabled(false),
      )
    }


    if (client.db.General.get(`ConfigGeral.statusduvidas`) == true) {
      row.addComponents(
        new ButtonBuilder()
          .setURL(`${client.db.General.get(`ConfigGeral.channelredirectduvidas`) == null ? `https://www.youtube.com/` : `${client.db.General.get(`ConfigGeral.channelredirectduvidas`)}`}`)
          .setLabel(`${client.db.General.get(`ConfigGeral.textoduvidas`) == null ? `Dúvida` : client.db.General.get(`ConfigGeral.textoduvidas`)}`)
          .setStyle(5)
          .setEmoji(`${client.db.General.get(`ConfigGeral.emojiduvidas`) == null ? `🔗` : client.db.General.get(`ConfigGeral.emojiduvidas`)}`)
          .setDisabled(false),
      )
    }

    if(client.user.id == '1249866472444919830' || client.user.id == '1231711607655235646'){
      let image = dd.embedconfig.banner

      if(!image) return interaction.reply({content: `Defina o banner do produto`})
      const attachment = new Discord.AttachmentBuilder(image, { name: 'banner.png' });

      interaction.channel.send({ files: [attachment], components: [row], content: `${client.db.produtos.get(`${id}.settings.desc`)}` }).then(async msg => {
        var g = client.db.produtos.get(`${id}`)
        try {
          const channel = await client.channels.fetch(g.ChannelID);
          const fetchedMessage = await channel.messages.fetch(g.MessageID);
          await fetchedMessage.delete();
        } catch (error) {
        }
  
  
        client.db.produtos.set(`${id}.MessageID`, msg.id)
        client.db.produtos.set(`${id}.ChannelID`, msg.channel.id)
      })


    }else{


      interaction.channel.send({ embeds: [embed], components: [row] }).then(async msg => {
        var g = client.db.produtos.get(`${id}`)
        try {
          const channel = await client.channels.fetch(g.ChannelID);
          const fetchedMessage = await channel.messages.fetch(g.MessageID);
          await fetchedMessage.delete();
        } catch (error) {
        }
  
  
        client.db.produtos.set(`${id}.MessageID`, msg.id)
        client.db.produtos.set(`${id}.ChannelID`, msg.channel.id)
      })
    }
   



    interaction.reply({ content: `${obterEmoji(8)} | Mensagem Atualizada!`, ephemeral: true })


  }
}