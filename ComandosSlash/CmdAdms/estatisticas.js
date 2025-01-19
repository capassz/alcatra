const Discord = require("discord.js");
const { StartPersonalizarMessage } = require("../../FunctionsAll/Personalizar");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('permissionsmessage2')

module.exports = {
  name: "estatisticas",
  description: '[🛠|💰 Vendas Moderação] Veja as estatistica de venda do bot',
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {

    let config = {
      method: 'GET',
      headers: {
        'Authorization': 'SUASENHA'
      }
    };
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 
    var u = client.db.estatisticasgeral.fetchAll()

    const brazilTimezoneOffset = -3 * 60; // Offset de -3 horas em minutos (GMT-3)
    const today = new Date();
    today.setMinutes(today.getMinutes() + brazilTimezoneOffset); // Ajusta para o horário do Brasil

    const formattedToday = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    sevenDaysAgo.setMinutes(sevenDaysAgo.getMinutes() + brazilTimezoneOffset); // Ajusta para o horário do Brasil
    const formattedSevenDaysAgo = `${String(sevenDaysAgo.getDate()).padStart(2, '0')}/${String(sevenDaysAgo.getMonth() + 1).padStart(2, '0')}/${sevenDaysAgo.getFullYear()}`;

    const thirtyDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    thirtyDaysAgo.setMinutes(thirtyDaysAgo.getMinutes() + brazilTimezoneOffset); // Ajusta para o horário do Brasil
    const formattedThirtyDaysAgo = `${String(thirtyDaysAgo.getDate()).padStart(2, '0')}/${String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0')}/${thirtyDaysAgo.getFullYear()}`;

    var hjprice = 0
    var hjqtd = 0
    var hjprodutos = 0

    var setediasPedidos = 0
    var setediasRecebidos = 0
    var setediasprodutos = 0

    var trintadiasPedidos = 0
    var trintadiasRecebidos = 0
    var trintadiasprodutos = 0

    var todosPedidios = 0
    var todosRecebidos = 0
    var todosprodutos = 0
    for (let iiii = 0; iiii < u.length; iiii++) {
      const element = u[iiii];
      if (element.data.Status == 'Entregue') {
        const elementDate = new Date(element.data.Data);
        const formattedElementDate = formatDate(elementDate); // Função auxiliar para formatar a data no formato dd/mm/yyyy


        if (formattedElementDate == formattedToday) {
          hjprice = Number(hjprice) + Number(element.data.valortotal)
          hjqtd = hjqtd + 1
          if (element.data.produtos !== undefined) {
            hjprodutos = hjprodutos + element.data.produtos
          }
        }

        if (elementDate >= sevenDaysAgo && elementDate <= today) {
          setediasRecebidos = Number(setediasRecebidos) + Number(element.data.valortotal)
          setediasPedidos = setediasPedidos + 1
          if (element.data.produtos !== undefined) {
            setediasprodutos = setediasprodutos + element.data.produtos
          }
        }

        if (elementDate >= thirtyDaysAgo && elementDate <= today) {
          trintadiasRecebidos = Number(trintadiasRecebidos) + Number(element.data.valortotal)
          trintadiasPedidos = trintadiasPedidos + 1
          if (element.data.produtos !== undefined) {
            trintadiasprodutos = trintadiasprodutos + element.data.produtos
          }
        }

        todosRecebidos = Number(todosRecebidos) + Number(element.data.valortotal)
        todosPedidios = todosPedidios + 1
        if (element.data.produtos !== undefined) {
          todosprodutos = todosprodutos + element.data.produtos
        }

      }
    }

    //interaction.reply({content: `Olá senhor ${interaction.user}, selecione algum filtro.`})
    const embed = new EmbedBuilder()
      .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
      .setDescription(`**Resumo das vendas de hoje**`)
      .addFields(
        { name: `**Rendimento**`, value: `\`${hjprice.toFixed(2)}\``, inline: true },
        { name: `**Pedidos aprovados**`, value: `\`${hjqtd}\``, inline: true },
        { name: `**Produtos entregues**`, value: `\`${hjprodutos}\``, inline: true },
      )
      .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTimestamp()
      .setFooter({ text: `${interaction.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("todayyyy")
          .setLabel('Hoje')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("7daysss")
          .setLabel('Últimos 7 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("30dayss")
          .setLabel('Últimos 30 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("totalrendimento")
          .setLabel('Rendimento Total')
          .setStyle(3)
          .setDisabled(false),
      )

    // const embed = new Discord.EmbedBuilder()
    //   .setTitle(`${obterEmoji(23)} | Seus rendimentos durante:`)
    //   .addFields(
    //     {
    //       name: `${obterEmoji(24)} | Hoje:`,
    //       value: `${obterEmoji(25)} | Pedidos: \`${hjqtd}\`\n${obterEmoji(23)} | Recebimentos: \`R$${hjprice.toFixed(2)}\``
    //     },
    //     {
    //       name: `${obterEmoji(24)} | Ultimos 7 dias:`,
    //       value: `${obterEmoji(25)} | Pedidos: \`${setediasPedidos}\`\n${obterEmoji(23)} | Recebimentos: \`R$${setediasRecebidos.toFixed(2)}\``
    //     },
    //     {
    //       name: `${obterEmoji(24)} | Ultimos 30 dias:`,
    //       value: `${obterEmoji(25)} | Pedidos: \`${trintadiasPedidos}\`\n${obterEmoji(23)} | Recebimentos: \`R$${trintadiasRecebidos.toFixed(2)}\``
    //     },
    //     {
    //       name: `${obterEmoji(18)} | Todo Periodo:`,
    //       value: `${obterEmoji(26)} | Pedidos: \`${todosPedidios}\`\n🐻 | Recebimentos: \`R$${todosRecebidos.toFixed(2)}\``
    //     }
    //   )

    interaction.reply({ content: `Olá senhor ${interaction.user}, selecione algum filtro.`, components: [row], ephemeral: true }).then(msg => {
      uu.set(msg.id, {
        user: interaction.user.id,
        Hoje: {
          Rendimento: hjprice.toFixed(2),
          Pedidos: hjqtd,
          Produtos: hjprodutos
        },
        SeteDays: {
          Rendimento: setediasRecebidos.toFixed(2),
          Pedidos: setediasPedidos,
          Produtos: setediasprodutos
        },
        TrintaDays: {
          Rendimento: trintadiasRecebidos.toFixed(2),
          Pedidos: trintadiasPedidos,
          Produtos: trintadiasprodutos
        },
        Total: {
          Rendimento: todosRecebidos.toFixed(2),
          Pedidos: todosPedidios,
          Produtos: todosprodutos
        }
      })

    })
  }
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}
