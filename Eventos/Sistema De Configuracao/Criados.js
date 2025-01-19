const { InteractionType, EmbedBuilder } = require('discord.js');
const { produtoscriados, criadoscupons, criadoskeys, criadossemstock, criadosgifts, criadosdrop, CriadosStart } = require('../../FunctionsAll/Criados');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('permissionsmessage10384')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.isButton()) {
            if (interaction.customId.startsWith('criadosproduto')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                CriadosStart(interaction, client)
                produtoscriados(interaction, client)
            }
            if (interaction.customId.startsWith('criadoscupons')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                CriadosStart(interaction, client)
                criadoscupons(interaction, client)
            }
            if (interaction.customId.startsWith('criadoskeys')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                CriadosStart(interaction, client)
                criadoskeys(interaction, client)
            }
            if (interaction.customId.startsWith('criadossemstock')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                CriadosStart(interaction, client)
                criadossemstock(interaction, client)
            }
            if (interaction.customId.startsWith('criadosgifts')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                CriadosStart(interaction, client)
                criadosgifts(interaction, client)
            }
            if (interaction.customId.startsWith('criadosdrop')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                CriadosStart(interaction, client)
                criadosdrop(interaction, client)
            }
        }
    }
}