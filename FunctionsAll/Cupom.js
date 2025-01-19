const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require('../Handler/EmojiFunctions');

const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('permissionsmessage333')

const editEmbed = {
    content: `⚠️ | Use o Comando Novamente!`,
    components: [],
    embeds: []
};

const editMessage = async (message) => {
    try {
        await message.edit(editEmbed)
    } catch (error) {

    }

};

const createCollector = (message) => {
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
    });

    collector.on('collect', () => {
        collector.stop();
    });

    collector.on('end', (collected) => {
        if (collected.size === 0) {

            editMessage(message);

        }
    });
};

function StartConfigCupom(interaction, client, user, cupom) {

    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${interaction.user.username} | Gerenciar Cupom`, iconURL: `${interaction.user.displayAvatarURL()}` })
        .setDescription(`- Painel de configuração `)
        .setFields(
            { name: `${obterEmoji(7)} | Nome:`, value: `${cupom}`, inline: true },
            { name: `${obterEmoji(19)} | Porcentagem de Desconto:`, value: `${Number(client.db.Cupom.get(`${cupom}.porcentagem`)).toFixed(0)}%`, inline: true },
            { name: `${obterEmoji(14)} | Valor Mínimo:`, value: `R$${Number(client.db.Cupom.get(`${cupom}.valorminimo`)).toFixed(2)}`, inline: true },
            { name: `${obterEmoji(12)} | Quantidade:`, value: `${Number(client.db.Cupom.get(`${cupom}.quantidade`)).toFixed(0)}`, inline: true },
            { name: `${obterEmoji(20)} | Só pode ser usado na categoria de produtos:`, value: client.db.Cupom.get(`${cupom}.categoria`) == null ? `Este cupom pode ser utilizado em qualquer produto!` : `<#${client.db.Cupom.get(`${cupom}.categoria`)}>` },
            { name: `${obterEmoji(20)} | Só pode ser usado pelo cargo:`, value: client.db.Cupom.get(`${cupom}.cargo`) == null ? `Este cupom pode ser utilizado por qualquer usuário!` : `<@&${client.db.Cupom.get(`${cupom}.cargo`)}>` }
        )
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        
    const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("changeporcentagemcupom")
                .setLabel('Porcentagem de desconto')
                .setEmoji(`1233103068942569543`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changevalorminimocupom")
                .setLabel('Valor Mínimo')
                .setEmoji(`1233103068942569543`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changequantidadecupom")
                .setLabel('Quantidade')
                .setEmoji(`1237122940617883750`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changecategoriacupom")
                .setLabel('Categoria')
                .setEmoji(`1233127513178247269`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changecargocupom")
                .setLabel('Cargo')
                .setEmoji(`1233127515141308416`)
                .setStyle(2)
                .setDisabled(false),)
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("deletecupomaaa")
                .setLabel('Deletar')
                .setEmoji(`1229787813046915092`)
                .setStyle(4)
                .setDisabled(false),)



    if (interaction.message == undefined) {
        interaction.reply({ embeds: [embed], components: [row, row2] }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            uu.set(lastMessage.id, {user: interaction.user.id, cupom: cupom})
            createCollector(u);
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {
            createCollector(u);
        })
    }
}


module.exports = {
    StartConfigCupom
};