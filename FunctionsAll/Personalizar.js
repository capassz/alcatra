const Discord = require("discord.js");
const { MessageEmbed, ModalBuilder, ButtonBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { QuickDB } = require("quick.db");
const { obterTodosEmojis, obterEmoji, editarEmoji, verificarEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('permissionsmessage2')
const emojiRegex = require('emoji-regex');

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




function StartPersonalizarMessage(interaction, client, user) {
    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${interaction.guild.name} | Personalizar Mensagem de Compra`)
        .setDescription(`Título atual: ${client.db.DefaultMessages.get(`ConfigGeral.embedtitle`)}\n\n**Descrição Atual:**\n${client.db.DefaultMessages.get(`ConfigGeral.embeddesc`)}\n\nRodapé Atual: ${client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) == null ? 'Não definido' : client.db.DefaultMessages.get(`ConfigGeral.embedrodape`)}`)
        .setFooter({ text: 'Escolha oque você deseja mudar:', iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpersonalizarembed")
                .setLabel('Título da embed')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpersonalizardesc")
                .setLabel('Descrição da embed')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpersonalizarrodape")
                .setLabel('Rodapé da embed')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpersonalizarbutton")
                .setLabel('Botão da embed')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("resetdefaultpersonalizar")
                .setLabel('Resetar embed')
                .setEmoji(`1237122940617883750`)
                .setStyle(4)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("attallmessagesdiscordjsprodutos")
                .setLabel('Atualizar Todas Mensagens de Compra')
                .setEmoji(`1238978383845654619`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("177627tg23y9f7e6rt8623nuhy28fyg")
                .setEmoji(`1237055536885792889`)
                .setStyle(1)
                .setDisabled(false),)
    if (interaction.message == undefined) {
        interaction.reply({ embeds: [embed], components: [row, row2] }).then(async u => {

            createCollector(u);
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {
            createCollector(u);
        })
    }
}


function buttonedits(interaction, client) {
    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Personalizar Mensagem de Compra`)
        .setDescription(`Texto do Botão: ${client.db.DefaultMessages.get(`ConfigGeral.textbutton`) == null ? '\`Comprar\`' : client.db.DefaultMessages.get(`ConfigGeral.textbutton`)}\n\nCor do Botão: ${client.db.DefaultMessages.get(`ConfigGeral.colorbutton`) == null ? '\`Azul\`' : client.db.DefaultMessages.get(`ConfigGeral.colorbutton`)}\n\nEmoji do Botão: ${client.db.DefaultMessages.get(`ConfigGeral.emojibutton`) == null ? '\`Não Definido\`' : client.db.DefaultMessages.get(`ConfigGeral.emojibutton`)}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("textbuttonasdkunaodygawdiakw")
                .setLabel('Texto do Botão')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("colorbuttonaDJAWGVKJL")
                .setLabel('Cor do Botão')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("emojibuttonuhdu8widpwodw")
                .setLabel('Emoji do Botão')
                .setEmoji(`1237122940617883750`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnashdawgviduwado1787231")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
                .setDisabled(false),)
    interaction.message.edit({ embeds: [embed], components: [row] }).then(u => {
        createCollector(u);
    })
}





function emojieditmessagedault(interaction, client) {
    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${interaction.guild.name} | Configuração Emojis`)
        .setDescription(`Selecione abaixo qual opção deseja alterar em seus amojis. É importante que você preste atenção nas configurações atuais para garantir que suas alterações sejam feitas corretamente. ${obterEmoji(7)}\n\n${obterTodosEmojis().join('\n')}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editemoji")
                .setLabel('Editar Emoji')
                .setEmoji(`1237122940617883750`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("RETURN881239131231")
                .setLabel('Voltar')
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.message.edit({ embeds: [embed], components: [row] }).then(async u => {
        createCollector(u);
    })
}



async function editemoji(interaction, client) {

    const modalaAA = new ModalBuilder()
        .setCustomId('iddoemoji')
        .setTitle(`${interaction.guild.name} - Id Emoji`);

    const newnameboteN = new TextInputBuilder()
        .setCustomId('emojiidid')
        .setLabel("ID DO EMOJI")
        .setPlaceholder("Exemplo: 2")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
    modalaAA.addComponents(firstActionRow3);
    await interaction.showModal(modalaAA);

}


function editemojiFunctions(interaction,client) {

    const emojiidid = interaction.fields.getTextInputValue('emojiidid');
    var inicio = obterEmoji(emojiidid)

    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${obterEmoji(8)} ${interaction.guild.name} | Configuração Emojis ${obterEmoji(8)}`)
        .setDescription(`${obterEmoji(22)} Você tentou alterar um EMOJI inexistente, tente novamente.\n\n${obterTodosEmojis().join('\n')}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editemoji")
                .setLabel('Editar Emoji')
                .setEmoji(`1237122940617883750`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("RETURN881239131231")
                .setLabel('Voltar')
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
                .setDisabled(false))

    if (verificarEmoji(emojiidid) == false) return interaction.message.edit({ embeds: [embed], components: [row] }).then(u => {
        createCollector(u);
    })


    const embed2 = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${obterEmoji(8)} ${interaction.guild.name} | Configuração Emojis ${obterEmoji(8)}`)
        .setDescription(`⚠️ Envie abaixo o emoji que deseja substituir o emoji ${obterEmoji(emojiidid)}, lembrando o BOT precisa estar no discord na qual este emoji vai estar.`)


    interaction.message.edit({ embeds: [embed2], components: [] }).then(msg => {
        const collectorFilter = response => {
            return response.author.id === interaction.user.id;
        };
        interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                const receivedMessage = collected.first();
                receivedMessage.delete()

                function verificarEmoji(mensagem) {
                    const emojiRegexPattern = emojiRegex();
                    const regex = /<:[^\s]+:\d+>|a/;
                
                    return emojiRegexPattern.test(mensagem) || regex.test(mensagem);
                }

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${obterEmoji(8)} ${interaction.guild.name} | Configuração Emojis ${obterEmoji(8)}`)
                    .setDescription(`${obterEmoji(22)} Você tentou alterar um EMOJI inválido ou inexistente, tente novamente.\n\n${obterTodosEmojis().join('\n')}`)
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("editemoji")
                            .setLabel('Editar Emoji')
                            .setEmoji(`1237122940617883750`)
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("RETURN881239131231")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false))

                if (verificarEmoji(receivedMessage.content) == false) return interaction.message.edit({ embeds: [embed], components: [row] }).then(u => {
                    createCollector(u);
                })

                editarEmoji(emojiidid, receivedMessage.content, client.user.id)


                const embed2 = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${obterEmoji(8)} ${interaction.guild.name} | Configuração Emojis ${obterEmoji(8)}`)
                    .setDescription(`${obterEmoji(8)} Você alterou o emoji ${inicio} pelo emoji ${receivedMessage}.\n\n${obterTodosEmojis().join('\n')}`)
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("editemoji")
                            .setLabel('Editar Emoji')
                            .setEmoji(`1237122940617883750`)
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("RETURN881239131231")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false))


                interaction.message.edit({ embeds: [embed2], components: [row2] }).then(u => {
                    createCollector(u);
                })

            })
    })

}

module.exports = {
    StartPersonalizarMessage,
    buttonedits,
    emojieditmessagedault,
    editemoji,
    editemojiFunctions
};