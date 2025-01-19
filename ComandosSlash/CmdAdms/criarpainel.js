const Discord = require("discord.js");
const { createpainel } = require("../../FunctionsAll/PainelSettingsAndCreate");


module.exports = {
  name: "criarpainel",
  description: "[🛠|💰 Vendas Moderação] Crie um Painel Select Menu Para Seus Produtos",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "Coloque o id para seu painel!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    { name: 'produto_id', description: 'Coloque o id de um produto para ser adicionado no painel', type: 3, required: true, autocomplete: true },
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
 

    let produto = interaction.options.getString('id');
    if (interaction.options._hoistedOptions[1].value == 'nada') return interaction.reply({ content: `Nenhum cupom registrado em seu BOT`, ephemeral: true })
    createpainel(interaction, client, produto, interaction.options._hoistedOptions[1].value)
  
  }
}