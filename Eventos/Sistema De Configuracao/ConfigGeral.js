const { UpdateStatusVendas, updateMessageConfig, UpdatePagamento, ConfigMP, ToggeMP, TimeMP, ToggleSaldo, bonusSaldo, ConfigSaldo, ConfigSemiAuto, ToggleSemiAuto, PixChangeSemiAuto, configbot, configbotToggle, FunctionCompletConfig, configchannels, configchannelsToggle, CompletConfigChannels, ConfigTermoConfig, ConfigTermo, ConfigCashBack, configmoderacao, autorole, definicoes } = require("../../FunctionsAll/BotConfig")
const { InteractionType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, RoleSelectMenuBuilder, ChannelType, ChannelSelectMenuBuilder, IntegrationExpireBehavior } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const axios = require('axios');
const { QuickDB } = require("quick.db");
const { automsg } = require("../../FunctionsAll/Blacklist");
const db = new QuickDB();
var uu = db.table('permissionsmessage')

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'timeMP') {

                TimeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'tokenMP') {
                //interaction.deferUpdate()
                TimeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'bonusSaldo') {

                bonusSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'SemiautoPix') {

                PixChangeSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'Semiautoqrcode') {

                PixChangeSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newnamebot') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeAvatar') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeColorBOT') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'AlterarMiniatura') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'AlterarBanner') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeStatusBOT') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newtermocompra') {

                ConfigTermoConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newanuncio') {

                const title = interaction.fields.getTextInputValue('title');
                const desc = interaction.fields.getTextInputValue('desc');
                const content = interaction.fields.getTextInputValue('content');
                const image = interaction.fields.getTextInputValue('image');
                const color = interaction.fields.getTextInputValue('color');

                const embed = new EmbedBuilder()
                    .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(title)
                    .setDescription(desc)

                if (color !== '') {
                    var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    var isHexadecimal = regex.test(color);
                    if (isHexadecimal) {
                        embed.setColor(color)
                    } else {
                        interaction.reply({ ephemeral: true, content: `${obterEmoji(21)} | Ocorreu algum erro, tem certeza que colocou as informações corretas?` })
                        return
                    }
                }
                if (image !== '') {
                    const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                    if (url.test(image)) {
                        embed.setThumbnail(image)
                    } else {
                        interaction.reply({ ephemeral: true, content: `${obterEmoji(21)} | Ocorreu algum erro, tem certeza que colocou as informações corretas?` })
                        return
                    }
                }
                if (content !== '') {
                    interaction.channel.send({ embeds: [embed], content: content })
                } else {
                    interaction.channel.send({ embeds: [embed] })
                }

                interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Anuncio enviado com sucesso!` })
            }








            if (interaction.customId === 'sdajuidsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');

                const stringSemEspacos = title.replace(/\s/g, '');
                const arrayDeBancos = stringSemEspacos.split(',');


                client.db.General.set(`ConfigGeral.BankBlock`, arrayDeBancos)
                const gfgfggfg = client.db.General.get(`ConfigGeral.BankBlock`)
                var hhhh = ''
                for (const key in gfgfggfg) {
                    const element = gfgfggfg[key];
                    hhhh += `${element}`;
                    if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
                        hhhh += ', ';
                    }
                }
                interaction.reply({ content: `${obterEmoji(8)} | Lista de bancos bloqueados foi atualizada com sucesso!\n\`${hhhh}\``, ephemeral: true })
            }






            if (interaction.customId === 'sdaju11111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('tokenMP3');




                if (title !== 'não') {
                    if (!isNaN(title)) {
                        client.db.General.set(`ConfigGeral.AntiFake.diasminimos`, Number(title))
                    } else {
                        interaction.reply({ content: `❌ | Você colocou um numero incorreto nos dias!`, ephemeral: true })
                        return
                    }
                } else {
                    client.db.General.set(`ConfigGeral.AntiFake.diasminimos`, 0)
                }


                if (title2 !== 'não') {

                    const stringSemEspacos = title2.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    client.db.General.set(`ConfigGeral.AntiFake.status`, arrayDeBancos)
                }


                if (title3 !== 'não') {

                    const stringSemEspacos = title3.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    client.db.General.set(`ConfigGeral.AntiFake.nomes`, arrayDeBancos)
                }


                interaction.reply({ content: `✅ | Todas configurações de Anti-Fake foram configuradas com sucesso!`, ephemeral: true })


            }



            if (interaction.customId === 'sdaju111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('qualcanal');


                const stringSemEspacos = title3.replace(/\s/g, '');
                const arrayDeBancos = stringSemEspacos.split(',');


                if (isNaN(title2) == true) return interaction.reply({ content: `❌ | Você colocou um tempo incorreto para a mensagem ser apagada!`, ephemeral: true })

                client.db.General.set('ConfigGeral.Entradas', {
                    msg: title,
                    tempo: title2,
                    channelid: arrayDeBancos,
                })

                interaction.reply({ content: `✅ | Todas configurações de Bem vindo foram configuradas com sucesso!`, ephemeral: true })
            }




        }



        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'wdawwadawwadwaroleaddautorole') {
                //interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                client.db.General.set(`ConfigGeral.AutoRole.add`, interaction.values)
                autorole(interaction, client)
                interaction.reply({ content: `O sistema de AutoRole foi configurado com sucesso`, ephemeral: true })



            }

            if (interaction.customId == 'ereggbggbroleremoveautorole') {
                //interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                client.db.General.set(`ConfigGeral.AutoRole.remove`, interaction.values)
                autorole(interaction, client)



                interaction.reply({ content: `O sistema de AutoRole foi configurado com sucesso`, ephemeral: true })
            }

        }

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'awdwat123ransferawdawdwadaw') {
                const titulo = interaction.fields.getTextInputValue('titulo');
                const descricao = interaction.fields.getTextInputValue('descricao');
                const bannerembed = interaction.fields.getTextInputValue('bannerembed');
                const buttomes = interaction.fields.getTextInputValue('buttomes');
                const idchanell = interaction.fields.getTextInputValue('idchanell');


                if (isNaN(buttomes) == true) return interaction.reply({ content: `O valor fornecido é incorreto, revise novamente`, ephemeral: true })

                function hasValidLink(text) {
                    const linkRegex = /(http|https):\/\/\S+/;

                    return linkRegex.test(text);
                }

                if (bannerembed !== '') {
                    if (!hasValidLink(bannerembed)) return interaction.reply({ content: `O banner fornecido é incorreto, revise novamente`, ephemeral: true })
                }
                client.db.General.push(`ConfigGeral.AutoMessage`, [{
                    titulo: titulo,
                    descricao: descricao,
                    bannerembed: bannerembed,
                    time: buttomes,
                    idchanell: idchanell
                }])

                automsg(interaction, client)
                return interaction.reply({ content: `O sistema foi configurado com sucesso! (REINICIE O BOT para funcionar perfeitamente!)`, ephemeral: true })

            }



            if (interaction.customId === 'awdwasdajdaawdu1111awdwadawdaw1idsjjsdua') {

                const tokenMP = interaction.fields.getTextInputValue('tokenMP');


                if (isNaN(tokenMP) == true) return interaction.reply({ content: `❌ | Número incorreto.`, ephemeral: true })

                const gggg = client.db.General.get(`ConfigGeral.AutoMessage`)

                if (gggg[tokenMP - 1] == undefined) return interaction.reply({ content: `❌ | Número incorreto.`, ephemeral: true })

                client.db.General.pull(`ConfigGeral.AutoMessage`, (element, index, array) => index == tokenMP - 1)


                interaction.reply({ content: `Removida com Sucesso`, ephemeral: true })
                automsg(interaction, client)



            }









            



        }



        if (interaction.isButton()) {

        

       

          

         


            if (interaction.customId == 'criarmsgauto') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('awdwat123ransferawdawdwadaw')
                    .setTitle(`Configurar Embed`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('titulo')
                    .setLabel(`Envie abaixo o Titulo da Embed`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(100)
                    .setRequired(false)


                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('descricao')
                    .setLabel("Envie abaixo a Mensagem")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('bannerembed')
                    .setLabel("Envie o Banner")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN444 = new TextInputBuilder()
                    .setCustomId('buttomes')
                    .setLabel("Quanto tempo? (Em segundos)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(150)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('idchanell')
                    .setLabel("Envie o ID do canal que será enviado")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(25)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN3);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN444);
                modalaAA.addComponents(firstActionRow3, firstActionRow2, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);


            }

            if (interaction.customId == 'automsgggs') {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                automsg(interaction, client)
            }


            if (interaction.customId == 'remmsgautomatica') {


                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('awdwasdajdaawdu1111awdwadawdaw1idsjjsdua')
                    .setTitle(`Configurar Mensagem Automatica`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`QUAL MENSAGEM DESEJA RETIRAR?`)
                    .setPlaceholder(`Envie apenas numeros.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)



                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);


                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);



            }




            if (interaction.customId == 'systemantifake') {


                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjsdua')
                    .setTitle(`Configurar anti fake`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`QUANTIDADE DE DIAS MÍNIMA PARA ENTRAR`)
                    .setPlaceholder(`Digite "não" para desativar, serve para todos os campos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`LISTA DE STATUS QUE DESEJA BLOQUEAR`)
                    .setPlaceholder(`Digite separado por vírgual os status das contas que deseja punir se detectadas.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(4000)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`LISTA DE NOMES QUE DESEJA BLOQUEAR`)
                    .setPlaceholder(`Digite separado por vírgual os nomes das contas que deseja punir se detectadas.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(4000)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);


            }



            if (interaction.customId == 'AdicionarNaAutorole') {

                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('wdawwadawwadwaroleaddautorole')
                            .setPlaceholder('Selecione abaixo qual será o CARGO vai dar AUTOMATICAMENTE.')
                            .setMaxValues(20)
                    )

                interaction.message.edit({ components: [select] })

            }


            if (interaction.customId == 'RemoverNaAutorole') {

                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('ereggbggbroleremoveautorole')
                            .setPlaceholder('Selecione abaixo qual será o CARGO vai dar AUTOMATICAMENTE.')
                            .setMaxValues(20)
                    )

                interaction.message.edit({ components: [select] })

            }




            if (interaction.customId == 'autorole') {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                autorole(interaction, client)


            }


            if (interaction.customId == 'boasveindas') {


                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju111idsjjsdua')
                    .setTitle(`Editar Boas Vindas`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`Mensagem`)
                    .setPlaceholder(`Insira aqui sua mensagem, use {member} para mencionar o membro e {guildname} para o servidor.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`TEMPO PARA APAGAR A MENSAGEM`)
                    .setPlaceholder(`Insira aqui a quantidade em segundos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(6)


                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('qualcanal')
                    .setLabel(`QUAL CANAL VAI SER ENVIADO?`)
                    .setPlaceholder(`Insira aqui o ID do canal que vai enviar. (ID, ID, ID)`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(200)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);

            }

            // if (interaction.customId == 'blockbank') {
            //     var t = await uu.get(interaction.message.id)
            //     if (interaction.user.id !== t) return interaction.deferUpdate()

            //     const gfgfggfg = client.db.General.get(`ConfigGeral.BankBlock`)

            //     var hhhh = ''
            //     for (const key in gfgfggfg) {
            //         const element = gfgfggfg[key];
            //         hhhh += `${element}`;
            //         if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
            //             hhhh += ', ';
            //         }
            //     }


            //     const modalaAA = new ModalBuilder()
            //         .setCustomId('sdajuidsjjsdua')
            //         .setTitle(`Bloquear Bancos`);

            //     const newnameboteN = new TextInputBuilder()
            //         .setCustomId('tokenMP')
            //         .setLabel("BANCOS BLOQUEADOS")
            //         .setPlaceholder(`Insira os bancos que deseja recusar separado por vírgula, ex: inter, nu`)
            //         .setStyle(TextInputStyle.Paragraph)
            //         .setValue(hhhh)
            //         .setRequired(true)
            //         .setMaxLength(1000)

            //     const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
            //     modalaAA.addComponents(firstActionRow3);
            //     await interaction.showModal(modalaAA);
            // }



            if (interaction.customId == '+18porra') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()

                const modalaAA = new ModalBuilder()
                    .setCustomId('tokenMP')
                    .setTitle(`Alterar Token`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel("TOKEN: APP_USR-2837005141447972-076717-c37...")
                    .setPlaceholder("APP_USR-2837005141447972-076717-c37...")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId == '-18porra') {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return


                const fernandinhaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://dev.promisse.app/mp/auth/${interaction.guild.id}/VendasPrivadav2`)
                            .setStyle(5)
                            .setLabel('Autorizar Mercado Pago'),
                        new ButtonBuilder()
                            .setCustomId('voltar1234sda')
                            .setStyle(1)
                            .setEmoji('1237055536885792889')

                    )

                const forFormat = Date.now() + 10 * 60 * 1000

                const timestamp = Math.floor(forFormat / 1000)

                interaction.message.edit({ embeds: [], content: `Autorizar seu **Mercado Pago** á **Rare Apps**\n\n**Status:** Aguardando você autorizar.\nEssa mensagem vai expirar em <t:${timestamp}:R>\n (Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`, components: [fernandinhaa] }).then(async msgg => {

                    const config = {
                        headers: {
                            Authorization: 'SUASENHA'
                        }
                    }

                    const response2 = await axios.get(`https://dev.promisse.app/mp/${interaction.guild.id}/VendasPrivadav2`, config)
                    const geral = response2.data;

                    var existia = null

                    if (geral.message !== 'Usuario nao encontado!') {
                        existia = geral.access_token
                    } else {
                        existia = 'Não definido'
                    }

                    var status = false;
                    var intervalId = null;
                    var tempoLimite = 5 * 60 * 1000;

                    if (status === false) {
                        intervalId = setInterval(async () => {
                            const response = await axios.get(`https://dev.promisse.app/mp/${interaction.guild.id}/VendasPrivadav2`, config);
                            const geral = response.data;

                            if (geral.message == 'Usuario nao encontado!') {
                                status = false;
                            } else {
                                if (existia === 'Não definido' || existia !== geral.access_token) {
                                    status = true;
                                    clearInterval(intervalId);
                                    client.db.General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`, geral.access_token)
                                    client.db.General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessIdade`, 'menor')

                                    const fernandinhaa = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('voltar1234sda')
                                                .setStyle(1)
                                                .setEmoji('1237055536885792889')

                                        )

                                    msgg.edit({
                                        content: `**Status:** ✅ Autorização bem sucedida!.`,
                                        components: [fernandinhaa]
                                    })
                                }
                            }
                        }, 5000);
                        setTimeout(() => {
                            clearInterval(intervalId);

                            const fernandinhaa = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('voltar1234sda')
                                        .setStyle(1)
                                        .setEmoji('1237055536885792889')

                                )

                            msgg.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setDescription('❌ | Você não se cadastrou durante 5 Minutos, cadastre-se novamente!')
                                ],
                                components: [fernandinhaa]
                            })

                        }, tempoLimite);
                    }
                })
            }






            if (interaction.customId == 'voltar1234sda') {
                interaction.deferUpdate()
                ConfigMP(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'vendastoggle') {
                interaction.deferUpdate()
                UpdateStatusVendas(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'returnconfig') {
                interaction.deferUpdate()
                updateMessageConfig(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'returndefinicoesconfig') {
                interaction.deferUpdate()
                definicoes(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'returnconfigmoderacao') {
                interaction.deferUpdate()
                configmoderacao(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'closepanel') {
                interaction.deferUpdate()
                interaction.message.delete()
            }

            if (interaction.customId == 'confirmpagament') {
                interaction.deferUpdate()
                UpdatePagamento(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigMP') {
                interaction.deferUpdate()
                ConfigMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'returnConfigMP') {
                interaction.deferUpdate()
                ConfigMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'returnUpdatePagamento') {
                interaction.deferUpdate()
                UpdatePagamento(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'PixMPToggle') {
                interaction.deferUpdate()
                ToggeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'SiteMPToggle') {
                interaction.deferUpdate()
                ToggeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'TimePagament') {
                ToggeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'TokenAcessMP') {
                ToggeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SaldoToggle') {
                interaction.deferUpdate()
                ToggleSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'BonusChange') {
                ToggleSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigSaldo') {
                interaction.deferUpdate()
                ConfigSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigSemiAuto') {
                interaction.deferUpdate()
                ConfigSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigCashBack') {
                interaction.deferUpdate()
                ConfigCashBack(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SemiautoToggle') {
                interaction.deferUpdate()
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SemiautoPix') {
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'Semiautoqrcode') {
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'configbot') {
                interaction.deferUpdate()
                configbot(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeName') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeAvatar') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeColorBOT') {
                configbotToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'AlterarBanner') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'AlterarMiniatura') {
                configbotToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeStatusBOT') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'configchannels') {
                interaction.deferUpdate()
                configchannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'vvconfigchannels') {
                interaction.deferUpdate()
                configchannels(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeChannelLogs') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ChangeChannelavaliar') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelentrada') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ChangeChannelsaida') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeChannelLogsPublica') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeChannelsugestao') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelCategoriaShop') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeCargoCliente') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ChangeChannelMod') {
                interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'changetermos') {
                ConfigTermo(interaction, interaction.user.id, client)
            }
        }

        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'canallog') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canalticketdirect') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canallogpublica') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canallogsugestao') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }



            if (interaction.customId == 'ChangeChannelsaida') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelentrada') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canallogavaliar') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelCategoriaShop') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ChangeChannelMod') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

        }
        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'ChangeCargoCliente') {
                interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

        }
    }
}
