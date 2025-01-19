const Discord = require("discord.js");
const { StartConfigProduto } = require("../../FunctionsAll/Createproduto");

module.exports = {
  name: "Configurar Produto",
  type: Discord.ApplicationCommandType.Message,



  run: async (client, interaction) => {


    let config = {
      method: 'GET',
      headers: {
        'Authorization': 'SUASENHA'
      }
    };
    const ddddd = require('../../dono.json')
    if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
 


    const message = await interaction.channel.messages.fetch(interaction.targetId);
    const ffff = message.components[0]?.components[0]?.data?.custom_id

    if (ffff == undefined) return interaction.reply({ ephemeral: true, content: `❌ | Você interagiu em uma mensagem na qual não é um PRODUTO para ser alteravel!` })

    const gggg = client.db.produtos.get(ffff)

    if (gggg == null) return interaction.reply({ ephemeral: true, content: `❌ | Você interagiu em uma mensagem na qual não é um PRODUTO para ser alteravel!` })


    const ggg = ffff?.replace(`_${interaction.guild.id}`, '')



    StartConfigProduto(interaction, ggg, client, interaction.user.id)

  }
}