const { getqrcode, CopiaECola } = require("../../FunctionsAll/Saldo")
const { obterEmoji } = require("../../Handler/EmojiFunctions")

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {
        if (interaction.isButton()) {
            if (interaction.customId.startsWith('deletemessageal')) {
                interaction.update({embeds: [], components: [], content: `${obterEmoji(7)} | Pagamento Cancelado`})
            }
            if (interaction.customId.startsWith('qrcodesaldo')) {
                getqrcode(interaction,interaction.user.id)
            }
            if (interaction.customId.startsWith('pixcopiaecolasaldo')) {
                CopiaECola(interaction,interaction.user.id)
            }      
        }
    }
}