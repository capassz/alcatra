const Discord = require("discord.js");
const { MessageEmbed, ApplicationCommandOptionType,PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: 'criarcupom',
  description: '[🛠 | 💰 Vendas Moderação] Crie um cupom de desconto',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'nome',
      description: 'Coloque o nome do novo cupom aqui!',
      type: Discord.ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'porcentagem',
      description: 'Coloque a porcentagem de desconto aqui!',
      type: Discord.ApplicationCommandOptionType.Number,
      required: true
    },
    {
      name: 'valorminimo',
      description: 'Coloque o valor minimo para que esse cupom possa ser utilizado! (Se precisar use ,)',
      type: Discord.ApplicationCommandOptionType.Number,
      required: true
    },
    {
      name: 'quantidade',
      description: 'Coloque a quantidade de usos do cupom aqui!',
      type: Discord.ApplicationCommandOptionType.Number,
      required: true
    },
    {
      name: 'categoria',
      description: 'Limitar o uso deste cupom à uma só categoria de produtos.',
      type: Discord.ApplicationCommandOptionType.Channel,
      channelTypes: [4],
      required: false
    },
    {
      name: 'cargo',
      description: 'Limitar o uso deste cupom à uma só cargo.',
      type: Discord.ApplicationCommandOptionType.Role,
      required: false
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
 

    const nome = interaction.options.getString('nome')
    const porcentagem = interaction.options.getNumber('porcentagem')
    const valorminimo = interaction.options.getNumber('valorminimo')
    const quantidade = interaction.options.getNumber('quantidade')
    const categoria = interaction.options.getChannel('categoria')
    const cargo = interaction.options.getRole('cargo')

    var g = client.db.Cupom.get(nome)

    if (g !== null) return interaction.reply({ content: `${obterEmoji(22)} | Já possui um CUPOM com o nome \`${nome}\` criado.` })

    const embed = new Discord.EmbedBuilder()
      .setTitle(`${client.user.username} | Sistema de Cupom`)
      .setDescription(`${obterEmoji(8)} | Cupom criado com sucesso!, use /configcupom ${nome}, para configura-lo`)
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    client.db.Cupom.set(nome, { porcentagem: porcentagem, valorminimo: Number(valorminimo), quantidade: quantidade })

    if (categoria) {
      client.db.Cupom.set(`${nome}.categoria`, categoria.id)
    }
    if (cargo) {
      client.db.Cupom.set(`${nome}.cargo`, cargo.id)
    }


    interaction.reply({ embeds: [embed], ephemeral: true })
  }
}