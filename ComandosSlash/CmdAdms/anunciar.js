const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, ApplicationCommandOptionType } = require("discord.js")


module.exports = {
    name: 'anunciar',
    description: "[🛠|Moderação] Envie um anuncio.",
    options: [

        {
            name: 'channel',
            description: 'Qual canal será enviado?',
            type: ApplicationCommandOptionType.Channel,
            required: true
        },

    ],
    run: async (client, inter) => {

        let config = {
            method: 'GET',
            headers: {
                'Authorization': 'SUASENHA'
            }
        };
        
        const ddddd = require('../../dono.json')
        if (ddddd.dono !== interaction.user.id) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
     


        let channel = inter.options.getChannel('channel')
        let embed = new EmbedBuilder()
            .setTitle("Configure abaixo os campos da embed que deseja configurar.")
            .setFooter({
                text: "Clique em cancelar para cancelar o anúncio."
            })
            .setColor("Blue")

        const send = new EmbedBuilder()



        const Message = await inter.reply({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('title')
                            .setLabel('⠀Titulo')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('desc')
                            .setLabel('Descrição')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('image')
                            .setLabel('Imagem')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('tumb')
                            .setLabel('Miniatura')
                            .setStyle(ButtonStyle.Secondary),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('autor')
                            .setLabel('⠀Author⠀')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('footer')
                            .setLabel('⠀Rodapé⠀')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('date')
                            .setLabel('⠀Data⠀')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('cor')
                            .setLabel('⠀Cor⠀')
                            .setStyle(ButtonStyle.Secondary),
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('cancelar')
                            .setLabel('Cancelar')
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('send')
                            .setLabel('⠀⠀⠀⠀⠀Enviar⠀⠀⠀⠀⠀')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('previw')
                            .setLabel('⠀Preview⠀')
                            .setStyle(ButtonStyle.Primary),
                    ),
            ]
        })

        const collector = Message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 360_000 });

        collector.on('collect', i => {
            if (i.user.id === inter.user.id) {
                if (i.customId == 'cancelar') {
                    i.deferUpdate()
                    i.deleteReply()
                } else if (i.customId == 'previw') {
                    i.reply({
                        embeds: [send],
                        ephemeral: true
                    }).catch(err => {
                        i.reply({
                            content: `❌ **|** Houve um erro ao processar o anuncio`,
                            ephemeral: true
                        })
                    })
                } else if (i.customId == 'send') {
                    i.deferUpdate()
                    i.deleteReply()
                    channel.send({
                        embeds: [send],
                        ephemeral: true
                    }).catch(err => {
                        i.reply({
                            content: `❌ **|** Houve um erro ao processar o anuncio`,
                            ephemeral: true
                        })
                    })
                } else if (i.customId == 'title') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Title')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Qual seria o titulo?")
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setTitle(`${inter.fields.getTextInputValue('text')}`)
                        })
                        .catch(err => { return err });
                } else if (i.customId == 'desc') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Desc')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Qual seria a desc?")
                                        .setStyle(TextInputStyle.Paragraph)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setDescription(`${inter.fields.getTextInputValue('text')}`)
                        })
                        .catch(err => { return err });
                } else if (i.customId == 'image') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Image')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Qual seria a imagem? Coloque link")
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setImage(`${inter.fields.getTextInputValue('text')}`)
                        })
                        .catch(err => { return err });
                } else if (i.customId == 'tumb') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Tumb')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Qual seria a Tumb? Coloque link")
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setThumbnail(`${inter.fields.getTextInputValue('text')}`)
                        })
                        .catch(err => { return err });
                } else if (i.customId == 'autor') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Autor')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Qual seria o autor?")
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setAuthor({ name: `${inter.fields.getTextInputValue('text')}` })
                        })
                        .catch(err => { return err });
                } else if (i.customId == 'footer') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Footer')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Qual seria o footer?")
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setFooter({ text: `${inter.fields.getTextInputValue('text')}` })
                        })
                        .catch(err => { return err });
                } else if (i.customId == 'date') {
                    i.deferUpdate()
                    send.setTimestamp()
                } else if (i.customId == 'cor') {
                    const date = 'edit_' + Date.now();
                    const collectorFilter = i => {
                        return i.user.id === inter.user.id && i.customId == date;
                    };

                    const modal = new ModalBuilder()
                        .setCustomId(date)
                        .setTitle('Cor')
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('text')
                                        .setLabel("Coloque a cor com hexadecimal")
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                    i.showModal(modal)
                    i.awaitModalSubmit({ time: 600_000, filter: collectorFilter })
                        .then(inter => {
                            inter.deferUpdate();
                            send.setColor(`${inter.fields.getTextInputValue('text')}`)
                        })
                        .catch(err => { return err });
                }
            }
        });
    }
}