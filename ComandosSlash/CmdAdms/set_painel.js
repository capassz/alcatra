const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { StartConfigProduto } = require("../../FunctionsAll/Createproduto");
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "set_painel",
  description: "[💰| Vendas Moderação] Sete o Painel",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
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
 


    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum produto registrado em seu BOT`, ephemeral: true })


    var tttttt = client.db.PainelVendas.get(interaction.options._hoistedOptions[0].value)

    var ttttttttt = tttttt.produtos

    var options = []
    for (let iiii = 0; iiii < ttttttttt.length; iiii++) {
      const element = ttttttttt[iiii];
      var bb = client.db.produtos.get(`${element}`)

      const option = {
        label: `${bb.settings.name}`,
        description: `💸 | Valor: ${Number(bb.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
        emoji: `${bb.painel == null ? '🛒' : bb.painel.emoji}`,
        value: `${bb.ID}`,
      };
      options.push(option);

    }
    const dddddd = client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#000000` : client.db.General.get(`ConfigGeral.ColorEmbed`)
    const embed = new EmbedBuilder()
      .setTitle(`${tttttt.settings.title}`)
      .setDescription(`${tttttt.settings.desc}`)
      .setColor(client.db.PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.color`) == null ? dddddd : client.db.PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.color`))

    if (tttttt.settings.banner !== null) {
      embed.setImage(tttttt.settings.banner)
    }
    if (tttttt.settings.miniatura !== null) {
      embed.setThumbnail(tttttt.settings.miniatura)
    }
    if (tttttt.settings.rodape !== null && tttttt.settings.rodape !== undefined) {
      embed.setFooter({ text: `${tttttt.settings.rodape}` })
    }

    if (options == 0) {
      const options2 = {
        label: `Nenhum Produto Cadastrado nesse Painel!`,
        emoji: `1229787813046915092`,
        value: `nada`,
      };

      options.push(options2);


    }

    const style2row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('buyprodutoporselect')
          .setPlaceholder(`${client.db.PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.placeholder`) == null ? 'Selecione um Produto' : client.db.PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.placeholder`)}`)
          .addOptions(options)
      )


    const row222 = new ActionRowBuilder()
    if (client.db.General.get(`ConfigGeral.statusduvidas`) == true) {
      row222.addComponents(
        new Discord.ButtonBuilder()
          .setURL(`${client.db.General.get(`ConfigGeral.channelredirectduvidas`) == null ? `https://www.youtube.com/` : `${client.db.General.get(`ConfigGeral.channelredirectduvidas`)}`}`)
          .setLabel(`${client.db.General.get(`ConfigGeral.textoduvidas`) == null ? `Dúvida` : client.db.General.get(`ConfigGeral.textoduvidas`)}`)
          .setStyle(5)
          .setEmoji(`${client.db.General.get(`ConfigGeral.emojiduvidas`) == null ? `🔗` : client.db.General.get(`ConfigGeral.emojiduvidas`)}`)
          .setDisabled(false),
      )
    }


    if (client.db.General.get(`ConfigGeral.statusduvidas`) == true) {

      let banner = tttttt.settings.banner
      let attachment
      if (client.user.id == '1249866472444919830' || client.user.id == '1231711607655235646') {
        if (!banner) return interaction.reply({ content: `Defina o banner do produto` })
         attachment = new Discord.AttachmentBuilder(banner, { name: 'banner.png' });
      }




      let aaaa = (client.user.id == '1231711607655235646' || client.user.id == '1249866472444919830') 
      ? { content: `${tttttt.settings.desc}`, files: [attachment], components: [style2row, row222] } 
      : { embeds: [embed], components: [style2row, row222] };
      interaction.channel.send(aaaa).then(async msg => {
        try {
          const channel = await client.channels.fetch(tttttt.ChannelID);
          const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);
          await fetchedMessage.delete();
        } catch (error) {
        }


        client.db.PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.MessageID`, msg.id)
        client.db.PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.ChannelID`, msg.channel.id)
      })

    } else {
      let attachment
      if (client.user.id == '1249866472444919830' || client.user.id == '1231711607655235646') {
        let banner = tttttt.settings.banner
        if (!banner) return interaction.reply({ content: `Defina o banner do produto` })
        attachment = new Discord.AttachmentBuilder(banner, { name: 'banner.png' });

      }



      let aaaa = (client.user.id == '1231711607655235646' || client.user.id == '1249866472444919830') 
      ? { content: `${tttttt.settings.desc}`, files: [attachment], components: [style2row] } 
      : { embeds: [embed], components: [style2row] };

      interaction.channel.send(aaaa).then(async msg => {
        try {
          const channel = await client.channels.fetch(tttttt.ChannelID);
          const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);
          await fetchedMessage.delete();
        } catch (error) {
        }


        client.db.PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.MessageID`, msg.id)
        client.db.PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.ChannelID`, msg.channel.id)
      })
    }


    interaction.reply({ content: `${obterEmoji(8)} | Mensagem Atualizada!`, ephemeral: true })


  }
}