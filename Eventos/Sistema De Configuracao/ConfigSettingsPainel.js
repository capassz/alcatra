const { EmbedBuilder, InteractionType, ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require("discord.js");
const { configembedpainel, configpainel, configprodutospainel, atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate")
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('painelsettings')
const emojiRegex = require('emoji-regex');
const { obterEmoji } = require("../../Handler/EmojiFunctions");
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == InteractionType.ModalSubmit) {



            if (interaction.customId === 'changesequenciaprodutos') {
                const t = await uu.get(interaction.message.id)
                const idproduto = interaction.fields.getTextInputValue('idproduto');
                const newposicaoproduto = interaction.fields.getTextInputValue('newposicaoproduto');

                if (!client.db.PainelVendas.get(`${t.painel}.produtos`).includes(idproduto)) return interaction.reply({ content: `${obterEmoji(22)} | Error: O produto não está cadastrado nesse painel!` }).then(m => {
                    configprodutospainel(interaction, client)
                    setTimeout(async () => {
                        try {
                            await m.delete()
                        } catch (error) { console.log(error) }
                    }, 2000);
                })

                var produtos2 = client.db.PainelVendas.get(`${t.painel}.produtos`)

                const indexProduto = produtos2.indexOf(idproduto);

                if (indexProduto !== -1 && newposicaoproduto >= 0 && newposicaoproduto < produtos2.length) {
                    produtos2.splice(newposicaoproduto, 0, produtos2.splice(indexProduto, 1)[0]);
                

                    interaction.deferUpdate()
                } else {
                    interaction.reply({ content: `${obterEmoji(21)} | Posição inválida!` }).then(m => {
                        configprodutospainel(interaction, client)
                        setTimeout(async () => {
                            try {
                                await m.delete()
                            } catch (error) { console.log(error) }
                        }, 2000);
                    })
                }

                client.db.PainelVendas.set(`${t.painel}.produtos`, produtos2)

                configprodutospainel(interaction, client)

            }








            if (interaction.customId === 'editpainelcolor') {
                const editpainelcolor = interaction.fields.getTextInputValue('editpainelcolor');
                const t = await uu.get(interaction.message.id)

                var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                var isHexadecimal = regex.test(editpainelcolor);

                if (isHexadecimal) {

                    client.db.PainelVendas.set(`${t.painel}.settings.color`, editpainelcolor)
                    configembedpainel(interaction, client)
                    interaction.deferUpdate()
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um COR diferente de HexaDecimal;` }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete()
                            } catch (error) { console.log(error) }
                        }, 3000);
                    })
                }
            }





            if (interaction.customId === 'editpainelBanner') {
                const t = await uu.get(interaction.message.id)
                const editpainelBanner = interaction.fields.getTextInputValue('editpainelBanner');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(editpainelBanner)) {

                    interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou o BANNER do seu Produto.` }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete()
                            } catch (error) { console.log(error) }
                        }, 3000);
                    })
                    client.db.PainelVendas.set(`${t.painel}.settings.banner`, editpainelBanner)
                    configembedpainel(interaction, client)
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um BANNER invalido para seu BOT;` }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete()
                            } catch (error) { console.log(error) }
                        }, 3000);
                    })
                }
            }


            if (interaction.customId === 'editpainelMiniatura') {
                const t = await uu.get(interaction.message.id)
                const editpainelMiniatura = interaction.fields.getTextInputValue('editpainelMiniatura');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(editpainelMiniatura)) {

                    interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou a MINIATURA do seu Produto.` }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete()
                            } catch (error) { console.log(error) }
                        }, 3000);
                    })
                    client.db.PainelVendas.set(`${t.painel}.settings.miniatura`, editpainelMiniatura)
                    configembedpainel(interaction, client)
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu uma MINIATURA invalido para seu BOT;` }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete()
                            } catch (error) { console.log(error) }
                        }, 3000);
                    })
                }
            }

        }


        if (interaction.isButton()) {



            if (interaction.customId.startsWith('configembedpainel')) {
                interaction.deferUpdate()
                configembedpainel(interaction, client)
            }

            if (interaction.customId.startsWith('uay89efg7t9a7wa87dawgbydaid76')) {
                interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)
                configpainel(interaction, t.painel, client, interaction.user.id)
            }



            if (interaction.customId.startsWith('deletarpainel')) {
                interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)

                var sasassasa  = client.db.PainelVendas.get(t.painel)

                try {
                    const channel = await client.channels.fetch(sasassasa.ChannelID);
                    await channel.messages.delete(sasassasa.MessageID);
                } catch (error) { console.log(error) }

                client.db.PainelVendas.delete(t.painel)
                interaction.message.edit({embeds: [], components: [], content: `✅ Você deletou o painel **${t.painel}**`})
            }

            if (interaction.customId.startsWith('atualizarmensagempainel')) {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                atualizarmensagempainel(interaction.guild.id, t.painel, client, interaction.user.id)
                
            }
            

            if (interaction.customId.startsWith('configprodutospainel')) {
                interaction.deferUpdate()
                configprodutospainel(interaction, client)
            }


            if (interaction.customId.startsWith('removeprodutopainel')) {

                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`Envie o ID do produto que você deseja remover do painel:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
           

                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configprodutospainel(interaction, client)
                            return
                        }

                        if (client.db.produtos.get(`${message.content}`) == null) return interaction.reply({ content: `${obterEmoji(22)} | Error: Produto Inexistente!` }).then(m => {
                            configprodutospainel(interaction, client)
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        if (!client.db.PainelVendas.get(`${t.painel}.produtos`).includes(message.content)) return interaction.reply({ content: `${obterEmoji(22)} | Error: O produto não está cadastrado nesse painel!` }).then(m => {
                            configprodutospainel(interaction, client)
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        var uuuuuuu = message.content
                        client.db.PainelVendas.pull(`${t.painel}.produtos`, (element, index, array) => element.uuuuuuu)
                        configprodutospainel(interaction, client)
                        interaction.channel.send({ content: `${obterEmoji(8)} | o produto ${message.content} foi removido deste painel.` }).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })
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
                        } catch (error) { console.log(error) }

                    });
                })
            }










            if (interaction.customId.startsWith('addprodutopainel')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`Envie o ID do produto que você queira adicionar no painel:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
            

                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configprodutospainel(interaction, client)
                            return
                        }

                        if (client.db.produtos.get(`${message.content}`) == null) return interaction.channel.send({ content: `${obterEmoji(22)} | Error: Produto Inexistente!` }).then(m => {
                            configprodutospainel(interaction, client)
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        if (client.db.PainelVendas.get(`${t.painel}.produtos`).includes(message.content)) return interaction.channel.send({ content: `${obterEmoji(22)} | Error: Este Produto Já Existe nesse Painel!` }).then(m => {
                            configprodutospainel(interaction, client)
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        client.db.PainelVendas.push(`${t.painel}.produtos`, message.content)
                        interaction.channel.send({ content: `${obterEmoji(8)} | o produto ${message.content} foi adicionado neste painel.` }).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })


                        configprodutospainel(interaction, client)
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
                        } catch (error) { console.log(error) }

                    });
                })
            }



            if (interaction.customId.startsWith('changesequenciaprodutos')) {
                const t = await uu.get(interaction.message.id)
                const modalaAA = new ModalBuilder()
                    .setCustomId('changesequenciaprodutos')
                    .setTitle(`Alterar Posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('idproduto')
                    .setLabel("ID DO PRODUTO:")
                    .setPlaceholder("Coloque o id do produto aqui.")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('newposicaoproduto')
                    .setLabel("NOVA POSIÇÃO:")
                    .setPlaceholder("Ex: 1")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
                modalaAA.addComponents(firstActionRow3, firstActionRow2);
                await interaction.showModal(modalaAA);
            }


            if (interaction.customId.startsWith('editpainelembed')) {
                interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)


                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Título Atual:**
${client.db.PainelVendas.get(`${t.painel}.settings.title`)}
Envie o novo título abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
               



                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configembedpainel(interaction, client)
                            return
                        }

                        client.db.PainelVendas.set(`${t.painel}.settings.title`, message.content)

                        msg.reply({ content: `${obterEmoji(8)} | Título atualizado com sucesso` }).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        configembedpainel(interaction, client)
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
                        } catch (error) { console.log(error) }

                    });
                })
            }



            if (interaction.customId.startsWith('editpaineldesc')) {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Descrição Atual:**
${client.db.PainelVendas.get(`${t.painel}.settings.desc`)}
Envie a nova descrição abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
              


                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configembedpainel(interaction, client)
                            return
                        }
                        
                        client.db.PainelVendas.set(`${t.painel}.settings.desc`, message.content)

                        interaction.channel.send({ content: `${obterEmoji(8)} | Descrição atualizado com sucesso` }).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        configembedpainel(interaction, client)
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
                        } catch (error) { console.log(error) }

                    });
                })
            }


            if (interaction.customId.startsWith('editpainelrodape')) {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Rodapé Atual:**
${client.db.PainelVendas.get(`${t.painel}.settings.rodape`) == null ? 'Sem Rodapé' : client.db.PainelVendas.get(`${t.painel}.settings.rodape`)}
Envie o novo rodapé abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
                  


                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configembedpainel(interaction, client)
                            return
                        }

                        client.db.PainelVendas.set(`${t.painel}.settings.rodape`, message.content)

                        msg.reply({ content: `${obterEmoji(8)} | Rodapé atualizado com sucesso` }).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        configembedpainel(interaction, client)
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
                        } catch (error) { console.log(error) }

                    });
                })
            }


            if (interaction.customId.startsWith('editpainelplaceholder')) {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`**Rodapé Atual:**\n${client.db.PainelVendas.get(`${t.painel}.settings.placeholder`) == null ? '\`Envie o novo Texto abaixo:\`' : client.db.PainelVendas.get(`${t.painel}.settings.placeholder`)}\nEnvie o novo Texto abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
                


                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configembedpainel(interaction, client)
                            return
                        }

                        client.db.PainelVendas.set(`${t.painel}.settings.placeholder`, message.content)

                        msg.reply({ content: `${obterEmoji(8)} | PlaceHolder atualizado com sucesso` }).then(m => {
                            setTimeout(() => {
                                m.delete()
                            }, 2000);
                        })

                        configembedpainel(interaction, client)
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
                        } catch (error) { console.log(error) }

                    });
                })
            }



            if (interaction.customId.startsWith('editpainelcolor')) {
                const t = await uu.get(interaction.message.id)
                const modalaAA = new ModalBuilder()
                    .setCustomId('editpainelcolor')
                    .setTitle(`${obterEmoji(1)} | Alterar Cor Painel`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('editpainelcolor')
                    .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
                    .setPlaceholder("#FF0000, #FF69B4, #FF1493")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }


            if (interaction.customId.startsWith('editpainelBanner')) {
                const t = await uu.get(interaction.message.id)
                const modalaAA = new ModalBuilder()
                    .setCustomId('editpainelBanner')
                    .setTitle(` | Alterar Banner do Painel`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('editpainelBanner')
                    .setLabel("LINK BANNER:")
                    .setPlaceholder("NOVO BANNER")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId.startsWith('editpainelMiniatura')) {
                const t = await uu.get(interaction.message.id)
                const modalaAA = new ModalBuilder()
                    .setCustomId('editpainelMiniatura')
                    .setTitle(`${obterEmoji(1)} | Alterar Miniatura do Painel`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('editpainelMiniatura')
                    .setLabel("LINK DA MINIATURA:")
                    .setPlaceholder("NOVO MINIATURA")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }
        }


        if (interaction.isAutocomplete()) {
            if (interaction.commandName == 'criarpainel') {
                var teste = client.db.produtos.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.produtos.filter(x => x.data.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }

            if (interaction.commandName == 'config_painel') {
                var teste = client.db.PainelVendas.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.PainelVendas.filter(x => x.data.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);


                const config = produtosSelecionados.map(x => {

                    return {
                        name: `🖥 | Painel - ${x.data.ID}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }

            if (interaction.commandName == 'set_painel') {
                var teste = client.db.PainelVendas.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.PainelVendas.filter(x => x.data.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `🖥 | Painel - ${x.data.ID}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }

            if (interaction.commandName == 'del') {
                var teste = client.db.produtos.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.produtos.filter(x => x.data.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }

            if (interaction.commandName == 'entregar') {
                var teste = client.db.produtos.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = client.db.produtos.filter(x => x.data.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }
        }

        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === 'changeemojipainelproduto') {
             interaction.deferUpdate()
                const embed = new EmbedBuilder()
                .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Painel`)
                    .setDescription(`Envie o emoji para trocar no Painél:\n\nCaso queira cancelar escreva abaixo **cancelar**`)
                 

                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if(message.content == `cancelar`){
                            configprodutospainel(interaction, client)
                            return
                        }


                        function verificarEmoji(mensagem) {
                            const emojiRegexPattern = emojiRegex();
                            const regex = /<:[^\s]+:\d+>/;
        
                            return emojiRegexPattern.test(mensagem) || regex.test(mensagem);
                        }

                        if (verificarEmoji(message.content) == false) return interaction.channel.send({ content: `${obterEmoji(22)} | Você tentou colocar um emoji invalido ou inexistente` }).then(u => {
                            configprodutospainel(interaction, client)
                            setTimeout(async () => {
                                try {
                                    await u.delete()
                                } catch (error) { console.log(error) }
                            }, 3000);
                        })

                        client.db.produtos.set(`${interaction.values[0]}.painel.emoji`, message.content)
                        configprodutospainel(interaction, client)
                        interaction.channel.send({ content: `${obterEmoji(8)} | Você alterou o emoji de um produto.` }).then(u => {
                    
                            setTimeout(async () => {
                                try {
                                    await u.delete()
                                } catch (error) { console.log(error) }
                            }, 3000);
                        })
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
                        } catch (error) { console.log(error) }

                    });
                })
            }

            if (interaction.values[0] === 'nada') {
                interaction.deferUpdate()
            }
        }

    }
}