const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ComponentType, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, UserSelectMenuBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { avaliacao } = require("../../FunctionsAll/ChackoutPagamentoNovo");
const db = new QuickDB();
var uud = db.table('avaliarrrrr')
const axios = require('axios');
const { UpdateCashBack, ConfigCashBack, configchannels, ButtonDuvidasPainel, SaldoInvitePainel, BlackListPainel, configmoderacao, definicoes, mensagemautogeral, configprodutosrespotar, adicionarprodutosrepostar, removerprodutosrepostar } = require("../../FunctionsAll/BotConfig");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const { AdicionarSaldo } = require("../../FunctionsAll/Saldo");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { atualizarmessageprodutosone, alterarestoqueproduto } = require("../../FunctionsAll/Createproduto");
const { SendAllMgs } = require("../../FunctionsAll/SendAllMgs");
var uu = db.table('permissionsmessage')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'modal_configurarrepostagem') {
                let repostagemaoreiniciar = interaction.fields.getTextInputValue('repostagemaoreiniciar').toLowerCase();
                const horario1 = interaction.fields.getTextInputValue('horario1')
                const horario2 = interaction.fields.getTextInputValue('horario2') 
                const horario3 = interaction.fields.getTextInputValue('horario3')

                if (repostagemaoreiniciar !== 'sim' && repostagemaoreiniciar !== 'não' && repostagemaoreiniciar != 'nao') return interaction.reply({ content: `❌ | Você adicionou um STATUS incorreto!`, ephemeral: true })
                const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!regex.test(horario1)) return interaction.reply({ content: `❌ | Você adicionou um HORÁRIO incorreto!`, ephemeral: true })

                if (horario2 && horario2 !== '' && horario2 !== 'remover') {
                    if (!regex.test(horario2)) return interaction.reply({ content: `❌ | Você adicionou um HORÁRIO incorreto!`, ephemeral: true })
                }

                if (horario3 && horario3 !== '' && horario3 !== 'remover') {
                    if (!regex.test(horario3)) return interaction.reply({ content: `❌ | Você adicionou um HORÁRIO incorreto!`, ephemeral: true })
                }

                if (horario2 === 'remover') {
                    await client.db.General.delete(`ConfigGeral.repostagemautomatica.horario2`)
                    await client.db.General.delete(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario2`)
                }

                if (horario3 === 'remover') {
                    await client.db.General.delete(`ConfigGeral.repostagemautomatica.horario3`)
                    await client.db.General.delete(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario3`)
                }
                    
                if (repostagemaoreiniciar == 'sim') {
                    repostagemaoreiniciar = true
                } else {
                    repostagemaoreiniciar = false
                }

                await client.db.General.set(`ConfigGeral.repostagemautomatica.reiniciar`, repostagemaoreiniciar)
                await client.db.General.set(`ConfigGeral.repostagemautomatica.horario1`, horario1)
                if (horario2 && horario2 !== '' && horario2 !== 'remover') await client.db.General.set(`ConfigGeral.repostagemautomatica.horario2`, horario2)
                if (horario3 && horario3 !== '' && horario3 !== 'remover') await client.db.General.set(`ConfigGeral.repostagemautomatica.horario3`, horario3)

                interaction.deferUpdate()
                mensagemautogeral(interaction, interaction.user.id, client)
            }
        }
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId.startsWith('adicionarprodutosrepostar_')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()

                let selecionados = interaction.values // está vindo o id do produto

                let produtosrespostar = []
                let existente = client.db.General.get('ConfigGeral.produtosrespostar') || []
                let produtoscadastrados = client.db.produtos.fetchAll()

                for (const produto of produtoscadastrados) {
                    if (selecionados.includes(produto.ID)) {
                        let produtoExistente = existente.find(p => p.id === produto.ID);
                        if (!produtoExistente) {
                            produtosrespostar.push({
                                id: produto.ID,
                                name: produto.data.settings.name
                            });
                        }
                    }
                }

                
                let antigos = client.db.General.get('ConfigGeral.produtosrespostar') || []
                client.db.General.set('ConfigGeral.produtosrespostar', [...antigos, ...produtosrespostar])

                await configprodutosrespotar(interaction, interaction.user.id, client)
                if (produtosrespostar.length <= 0) {
                    interaction.reply({ content: `❌ | Produtos selecionados ja estão cadastrados.`, ephemeral: true })
                } else {
                    interaction.reply({ content: `✅ | Produtos adicionados com sucesso!`, ephemeral: true })
                }
            }
            if (interaction.customId.startsWith('removerprodutosrepostar_')) {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()

                let selecionados = interaction.values // está vindo o id do produto

                let produtosrespostar = []
                let existente = client.db.General.get('ConfigGeral.produtosrespostar') || []
                let produtoscadastrados = client.db.produtos.fetchAll()

                for (const produto of produtoscadastrados) {
                    if (selecionados.includes(produto.ID)) {
                        let produtoExistente = existente.find(p => p.id === produto.ID);
                        if (produtoExistente) {
                            produtosrespostar.push({
                                id: produto.ID,
                                name: produto.data.settings.name,
                                tempo: '18:00'
                            });
                        }
                    }
                }

                let antigos = client.db.General.get('ConfigGeral.produtosrespostar') || []
                client.db.General.set('ConfigGeral.produtosrespostar', antigos.filter(p => !selecionados.includes(p.id)))

                await configprodutosrespotar(interaction, interaction.user.id, client)
                if (produtosrespostar.length <= 0) {
                    interaction.reply({ content: `❌ | Produtos selecionados não estão cadastrados.`, ephemeral: true })
                } else {
                    interaction.reply({ content: `✅ | Produtos removidos com sucesso!`, ephemeral: true })
                }
            }
        }
        if (interaction.isButton()) {

            if (interaction.customId == 'configurarrepostagem') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()

                if (client.db.General.get(`ConfigGeral.repostagemautomatica.status`) != true) {
                    interaction.reply({ content: `Ative o Status para configurar o sistema!`, ephemeral: true })
                    return
                }

                const modal = new ModalBuilder()
                    .setCustomId('modal_configurarrepostagem')
                    .setTitle('🔁 | Configurações de repostagem')

                const repostagemaoreiniciar = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('repostagemaoreiniciar')
                        .setLabel(`REPOSTAR AO REINICIAR O BOT?`)
                        .setPlaceholder('"SIM" ou "NÃO"')
                        .setValue(`${client.db.General.get(`ConfigGeral.repostagemautomatica.reiniciar`) == true ? 'SIM' : 'NÃO'}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )
                const horario1 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('horario1')
                        .setLabel(`HORÁRIO DA REPOSTAGEM`)
                        .setPlaceholder('Exemplo: 12:00')
                        .setValue(`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`) ? client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`) : '20:00'}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                )

                const horario2 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('horario2')
                        .setLabel(`HORÁRIO DA REPOSTAGEM (OPCIONAL)`)
                        .setPlaceholder('Exemplo: 16:00 ou remover')
                        .setValue(`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`) ? client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`) : ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )

                const horario3 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('horario3')
                        .setLabel(`HORÁRIO DA REPOSTAGEM (OPCIONAL)`)
                        .setPlaceholder('Exemplo: 18:00 ou remover')
                        .setValue(`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`) ? client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`) : ''}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                )

                modal.addComponents(repostagemaoreiniciar, horario1, horario2, horario3)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'returnconfigprodutosrespotar') {
                interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                configprodutosrespotar(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'configprodutosrespotar') { // 1243710889782280222
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                configprodutosrespotar(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'adicionarprodutos') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                let produtoscadastrados = client.db.produtos.fetchAll()
                if (produtoscadastrados.length <= 0 || produtoscadastrados == null) {
                    interaction.reply({ content: `❌ | Não há produtos cadastrados!`, ephemeral: true })
                    return
                }
                adicionarprodutosrepostar(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'removerprodutos') {
                interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                removerprodutosrepostar(interaction, interaction.user.id, client)
            }
        }
    }
}