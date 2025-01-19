
const { UpdateStatusVendas, updateMessageConfig, UpdatePagamento, ConfigMP, ToggeMP, TimeMP, ToggleSaldo, bonusSaldo, ConfigSaldo, ConfigSemiAuto, ToggleSemiAuto, PixChangeSemiAuto, configbot, configbotToggle, FunctionCompletConfig, configchannels, configchannelsToggle, CompletConfigChannels, ConfigTermoConfig, ConfigTermo } = require("../../FunctionsAll/BotConfig")
const { InteractionType, EmbedBuilder, ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, RoleSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const { StartConfigCupom } = require("../../FunctionsAll/Cupom");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('permissionsmessage333')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.isButton()) {
            if (interaction.customId.startsWith('copiarecolar')) {
                let pix = client.db.PagamentosSaldos.get(`${interaction.user.id}.pix`)
                interaction.reply({ content: `${pix}`, ephemeral: true })
            }
            if (interaction.customId.startsWith('deletecupomaaa')) {
                var t = await uu.get(interaction.message.id)
                interaction.reply({content: `${obterEmoji(22)} | Você deletou o cupom \`${t.cupom}\``, ephemeral: true})
                client.db.Cupom.delete(t.cupom)
                interaction.message.delete()
            }

            if (interaction.customId.startsWith('changeporcentagemcupom')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()

                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Cupom`)
                    .setDescription(`**Porcentagem de Desconto Atual:** \`${Number(client.db.Cupom.get(`${t.cupom}.porcentagem`)).toFixed(0)}%\`\nEnvie a nova porcentagem abaixo:`)


                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()
                        var u = message.content
                        var apenasNumeros = /^\d+$/.test(u);
                        if (apenasNumeros) {
                            if (u <= 0) return msg.reply({ content: `${obterEmoji(22)} | "${Number(u).toFixed(0)}" Valor Inválido!`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            msg.reply({ content: `${obterEmoji(8)} | A porcentagem de Desconto desse cupom foi atualizada com sucesso para ${Number(u).toFixed(0)}%.`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            client.db.Cupom.set(`${t.cupom}.porcentagem`, Number(u).toFixed(0))
                            StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
                        } else {
                            msg.reply({ content: `${obterEmoji(22)} | "${Number(u).toFixed(0)}" Valor Inválido!`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
                        }
                    })
                    collector.on('end', async (message) => {
                        collector.stop()

                        if (message.size >= 1) return
                        try {
                            await interaction.message.edit({
                                content: `⚠️ | Use o Comando Novamente!`,
                                components: [],
                                embeds: []
                            })
                        } catch (error) {

                        }

                    });
                })
            }




            if (interaction.customId.startsWith('changevalorminimocupom')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()

                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Cupom`)
                    .setDescription(`**Valor Mínimo Atual: ** \`R$${Number(client.db.Cupom.get(`${t.cupom}.valorminimo`)).toFixed(2)}\`\nEnvie o novo Valor Mínimo abaixo:`)
                 


                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()
                        var u = message.content
                        var apenasNumerosComPonto = /^\d+(\.\d+)?$/.test(u);
                        if (apenasNumerosComPonto) {
                            if (u < 0) return msg.reply({ content: `${obterEmoji(22)} | "${Number(u).toFixed(0)}" Valor Inválido!`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            msg.reply({ content: `${obterEmoji(8)} | O valor mínimo desse cupom foi atualizado com sucesso para R$ ${Number(u).toFixed(2)}.`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            client.db.Cupom.set(`${t.cupom}.valorminimo`, Number(u).toFixed(2))
                            StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
                        } else {
                            msg.reply({ content: `${obterEmoji(22)} | "${u}" Valor Inválido!`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
                        }
                    })
                    collector.on('end', async (message) => {
                        collector.stop()

                        if (message.size >= 1) return
                        try {
                            await interaction.message.edit({
                                content: `⚠️ | Use o Comando Novamente!`,
                                components: [],
                                embeds: []
                            })
                        } catch (error) {

                        }

                    });
                })
            }



            if (interaction.customId.startsWith('changequantidadecupom')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()

                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Cupom`)
                    .setDescription(`**Quantidade Atual:** \`${Number(client.db.Cupom.get(`${t.cupom}.quantidade`)).toFixed(0)}\`\nEnvie a nova quantidade abaixo:`)
                   


                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()
                        var u = message.content
                        var apenasNumeros = /^\d+$/.test(u);

                        if (apenasNumeros) {
                            if (u <= 0) return msg.reply({ content: `${obterEmoji(22)} | "${Number(u).toFixed(0)}" Valor Inválido!`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            msg.reply({ content: `${obterEmoji(8)} | A quantide desse cupom foi atualizada com sucesso para ${Number(u).toFixed(0)}.`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            client.db.Cupom.set(`${t.cupom}.quantidade`, Number(u).toFixed(0))
                            StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
                        } else {
                            msg.reply({ content: `${obterEmoji(22)} | "${Number(u).toFixed(0)}" Valor Inválido!`, ephemeral: true }).then(msg2 => {
                                setTimeout(() => {
                                    msg2.delete()
                                }, 3000);
                            })
                            StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
                        }
                    })
                    collector.on('end', async (message) => {
                        collector.stop()

                        if (message.size >= 1) return
                        try {
                            await interaction.message.edit({
                                content: `⚠️ | Use o Comando Novamente!`,
                                components: [],
                                embeds: []
                            })
                        } catch (error) {

                        }

                    });
                })
            }


            if (interaction.customId.startsWith('2937gyf8gefw6t634r3r3f')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
            }

            if (interaction.customId.startsWith('yhds8cdy98vby9duv9s7sdb')) {
                var t = await uu.get(interaction.message.id)
                interaction.reply({ content: `${obterEmoji(8)} | Você liberou para esse cupom ser utilizado em todas categorias.` }).then(msg2 => {
                    setTimeout(() => {
                        msg2.delete()
                    }, 3000);
                })
                client.db.Cupom.delete(`${t.cupom}.categoria`)
                StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
            }

            if (interaction.customId.startsWith('yhds8cd9s7sdb')) {
                var t = await uu.get(interaction.message.id)
                interaction.reply({ content: `${obterEmoji(8)} | Você liberou para esse cupom ser utilizado por todos.` }).then(msg2 => {
                    setTimeout(() => {
                        msg2.delete()
                    }, 3000);
                })
                client.db.Cupom.delete(`${t.cupom}.cargo`)
                StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
            }
            



            if (interaction.customId.startsWith('changecategoriacupom')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()

                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Cupom`)
                    .setDescription(`**Categoria atual:** ${client.db.Cupom.get(`${t.cupom}.categoria`) == null ? `\`Este cupom pode ser utilizado em qualquer produto!\`` : `<#${client.db.Cupom.get(`${t.cupom}.categoria`)}>`}\nSelecione abaixo nova categoria:`)
                   

                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('changequantidadecupom')
                            .setPlaceholder('Selecione abaixo qual será a CATEGORIA que será permitido o usó desse cupom.')
                            .setMaxValues(1)
                            .addChannelTypes(ChannelType.GuildCategory)
                    )
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("yhds8cdy98vby9duv9s7sdb")
                            .setLabel('Remover')
                            .setEmoji(`${obterEmoji(22)}`)
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("2937gyf8gefw6t634r3r3f")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false),
                    )


                interaction.message.edit({ embeds: [embed], components: [select, row2] }).then(msg => {
                })
            }

            if (interaction.customId.startsWith('changecargocupom')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()

                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Cupom`)
                    .setDescription(`**Cargo atual:** ${client.db.Cupom.get(`${t.cupom}.cargo`) == null ? `\`Este cupom pode ser utilizado por qualquer usuário!\`` : `<@&${client.db.Cupom.get(`${t.cupom}.cargo`)}>`}\nSelecione abaixo novo CARGO:`)
                   

                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('changecargocupom')
                            .setPlaceholder('Selecione abaixo qual CARGO poderá utilizar esse CUPOM.')
                            .setMaxValues(1)
                    )
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("yhds8cd9s7sdb")
                            .setLabel('Remover')
                            .setEmoji(`${obterEmoji(22)}`)
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("2937gyf8gefw6t634r3r3f")
                            .setLabel('Voltar')
                            .setEmoji(`1237055536885792889`)
                            .setStyle(2)
                            .setDisabled(false),
                    )


                interaction.message.edit({ embeds: [embed], components: [select, row2] }).then(msg => {
                })
            }
        }


        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'changequantidadecupom') {
                interaction.reply({ content: `${obterEmoji(8)} | O seu CUPOM foi definido para ser utilizado apenas na categoria <#${interaction.values[0]}>`, ephemeral: true })
                var t = await uu.get(interaction.message.id)

                client.db.Cupom.set(`${t.cupom}.categoria`, interaction.values[0])

                StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
            }
        }


        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'changecargocupom') {
                interaction.reply({ content: `${obterEmoji(8)} | O seu CUPOM foi definido para apenas o cargo <@&${interaction.values[0]}> conseguir utilizar`, ephemeral: true })
                var t = await uu.get(interaction.message.id)

                client.db.Cupom.set(`${t.cupom}.cargo`, interaction.values[0])

                StartConfigCupom(interaction, client, interaction.user.id, t.cupom)
            }

        }




        if (interaction.isAutocomplete()) {
            if (interaction.commandName == 'configcupom') {

                var teste = client.db.Cupom.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.Cupom.filter(x => x.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    return {
                        name: `✔ | CUPOM - ${x.ID} 💸 | Desconto - ${x.data.porcentagem} ${obterEmoji(12)} | Quantidade - ${x.data.quantidade} `,
                        value: `${x.ID}`
                    }
                })

                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }
        }

    }
}