const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { obterEmoji } = require("../../Handler/EmojiFunctions");



module.exports = {
    name: 'guildMemberRemove',

    run: async (member, client) => {


        const gg = client.db.entradas.get(member.user.id)
        if (gg == null) {
            await client.db.entradas.set(member.user.id, { saidas: 1 })
        }else{
            await client.db.entradas.set(member.user.id, { saidas: gg.saidas+1 })
        }

        const gg2 = client.db.entradas.get(member.user.id)




        const embed = new EmbedBuilder()
        .setTitle(`${obterEmoji(31)} | Saida`)
        .setDescription(`
    ${member.user} **${member.user.username}** saiu do servidor
    `)
        .setFooter({
            text: `${member.guild.name}`
        })
        .setTimestamp()
        .setColor('#ff1c20')

        try {
            const channela = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`));
            channela.send({ embeds: [embed] })
        } catch (error) {

        }



    }
}