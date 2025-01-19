const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { obterEmoji } = require("../../Handler/EmojiFunctions");


module.exports = {
  name: "gerarpix",
  description: '[💰 | Vendas] Gere uma cobrança.',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor para ser Resgatado",
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



    let valor = interaction.options.getNumber('valor');





    interaction.reply({ content: `${obterEmoji(10)} | Gerando pagamento...` }).then(async msg => {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();

        var payment_data = {
          transaction_amount: Number(valor),
          description: `Pagamento - ${interaction.guild.name} - ${interaction.user.id}`,
          payment_method_id: 'pix',
          payer: {
            email: `${interaction.user.id}@gmail.com`,
            first_name: `Victor André`,
            last_name: `Ricardo Almeida`,
            identification: {
              type: 'CPF',
              number: '15084299872'
            },

            address: {
              zip_code: '86063190',
              street_name: 'Rua Jácomo Piccinin',
              street_number: '971',
              neighborhood: 'Pinheiros',
              city: 'Londrina',
              federal_unit: 'PR'
            }
          }
        }

        mercadopago.configurations.setAccessToken(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
        const data = await mercadopago.payment.create(payment_data);

        uu.set(lastMessage.id, { user: interaction.user.id, qrcode: data.body.point_of_interaction.transaction_data.qr_code_base64, pixcopiaecola: data.body.point_of_interaction.transaction_data.qr_code, id: data.body.id, })
        var tt = client.db.General.get('ConfigGeral')

        let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000

        const buffer = Buffer.from(data.body.point_of_interaction.transaction_data.qr_code_base64, "base64");
        const attachment = new Discord.AttachmentBuilder(buffer, { name: "payment.png" });

        let timestamp = Math.floor(forFormat / 1000)
        const embed = new EmbedBuilder()
          .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
          .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setFields(
            { name: `Código copia e cola`, value: `\`\`\`${data.body.point_of_interaction.transaction_data.qr_code}\`\`\``, inline: false }
          )
          .setImage(`attachment://payment.png`)

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("pixcdawdwadawdwdopiawdwawdwadecola182381371")
              .setLabel('Copia e Colar')
              .setEmoji(`1233200554252042260`)
              .setStyle(2),
            new ButtonBuilder()
              .setCustomId("cancelgeneratepix")
              .setEmoji(`1229787813046915092`)
              .setStyle(4)
              .setDisabled(false),
          )

        msg.edit({ content: ``, embeds: [embed], components: [row], files: [attachment] }).then(msggggg => {
          setTimeout(async () => {
            try {
              await msggggg.delete()
            } catch (error) {
              console.error("Error deleting message:", error);
            }
          }, tt.MercadoPagoConfig.TimePagament * 60 * 1000);
        })
      } catch (error) {
        interaction.followUp({ content: `Gerar Pix apenas com MERCADO PAGO!`, ephemeral: true })

        // You can send an error message to a specific channel or user here.
      }
    })


  }
}