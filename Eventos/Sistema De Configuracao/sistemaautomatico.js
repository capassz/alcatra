const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ComponentType, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, UserSelectMenuBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { acoesautomaticas, autolock, mensagemabertura, testarbertura, testarfechamento, mensagemfechamento } = require("../../FunctionsAll/BotConfig");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
var uu = db.table('permissionsmessage')


module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'horarioautolock') {
                const fechamento = interaction.fields.getTextInputValue('fechamento')
                const abertura = interaction.fields.getTextInputValue('abertura')
                let apagarmensagens = interaction.fields.getTextInputValue('apagarmensagens').toLowerCase()

                const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!regex.test(fechamento) || !regex.test(abertura)) {
                    return interaction.reply({ content: 'Horário inválido, por favor insira um horário válido.', ephemeral: true })
                }

                if (apagarmensagens !== 'sim' && apagarmensagens !== 'nao' && apagarmensagens !== 'não') {
                    return interaction.reply({ content: 'Opção inválida, por favor insira uma opção válida. "Sim" ou "Não"', ephemeral: true })
                }

                if (apagarmensagens === 'sim') {
                    apagarmensagens = true
                } else {
                    apagarmensagens = false
                }


                client.db.General.set('ConfigGeral.autolock.fechamento', fechamento)
                client.db.General.set('ConfigGeral.autolock.abertura', abertura)
                client.db.General.set('ConfigGeral.autolock.apagarmensagens', apagarmensagens)

                autolock(interaction, interaction.user.id, client, 1)
            }
            if (interaction.customId === 'mensagemabertura') {
                const mensagem = interaction.fields.getTextInputValue('mensagem')
                await client.db.General.set('ConfigGeral.autolock.mensagemabertura.content', mensagem)
                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'setarembedabertura') {
                const title = interaction.fields.getTextInputValue('title')
                const description = interaction.fields.getTextInputValue('description')
                const color = interaction.fields.getTextInputValue('color') || '#2b2d31'

                if (!/^#[0-9A-F]{6}$/i.test(color)) {
                    return interaction.reply({ content: 'Cor inválida, por favor insira uma cor válida.', ephemeral: true })
                }

                await client.db.General.set('ConfigGeral.autolock.mensagemabertura.title', title)
                await client.db.General.set('ConfigGeral.autolock.mensagemabertura.description', description)
                await client.db.General.set('ConfigGeral.autolock.mensagemabertura.color', color)

                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'imagemabertura') {
                const banner = interaction.fields.getTextInputValue('banner')
                const thumbnail = interaction.fields.getTextInputValue('thumbnail')
                const imagem = interaction.fields.getTextInputValue('imagem')

                if (banner) {
                    if (!banner.includes('http')) {
                        return interaction.reply({ content: 'URL inválida, por favor insira uma URL válida.', ephemeral: true })
                    }
                    await client.db.General.set('ConfigGeral.autolock.mensagemabertura.banner', banner)
                }
                if (thumbnail) {
                    if (!thumbnail.includes('http')) {
                        return interaction.reply({ content: 'URL inválida, por favor insira uma URL válida.', ephemeral: true })
                    }
                    await client.db.General.set('ConfigGeral.autolock.mensagemabertura.thumbnail', thumbnail)
                }
                if (imagem) {
                    if (!imagem.includes('http')) {
                        return interaction.reply({ content: 'URL inválida, por favor insira uma URL válida.', ephemeral: true })
                    }
                    await client.db.General.set('ConfigGeral.autolock.mensagemabertura.contentimage', imagem)
                }

                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'mensagemfechamento') {
                const mensagem = interaction.fields.getTextInputValue('mensagem')
                await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.content', mensagem)
                mensagemfechamento(interaction, interaction.user.id, client)
            }
         
          
            if (interaction.customId === 'setarembedfechamento') {
                const title = interaction.fields.getTextInputValue('title')
                const description = interaction.fields.getTextInputValue('description')
                const color = interaction.fields.getTextInputValue('color') || '#2b2d31'

                if (!/^#[0-9A-F]{6}$/i.test(color)) {
                    return interaction.reply({ content: 'Cor inválida, por favor insira uma cor válida.', ephemeral: true })
                }

                await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.title', title)
                await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.description', description)
                await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.color', color)

                mensagemfechamento(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'imagemfechamento') {
                const banner = interaction.fields.getTextInputValue('banner')
                const thumbnail = interaction.fields.getTextInputValue('thumbnail')
                const imagem = interaction.fields.getTextInputValue('imagem')

                if (banner) {
                    if (!banner.includes('http')) {
                        return interaction.reply({ content: 'URL inválida, por favor insira uma URL válida.', ephemeral: true })
                    }
                    await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.banner', banner)
                }
                if (thumbnail) {
                    if (!thumbnail.includes('http')) {
                        return interaction.reply({ content: 'URL inválida, por favor insira uma URL válida.', ephemeral: true })
                    }
                    await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.thumbnail', thumbnail)
                }
                if (imagem) {
                    if (!imagem.includes('http')) {
                        return interaction.reply({ content: 'URL inválida, por favor insira uma URL válida.', ephemeral: true })
                    }
                    await client.db.General.set('ConfigGeral.autolock.mensagemfechamento.contentimage', imagem)
                }

                mensagemfechamento(interaction, interaction.user.id, client)
            }
          

         
        }
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId == '') {
            }
        }
        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'addcanalautolock') {  
                let canais = interaction.values
                let canaisdb = client.db.General.get('ConfigGeral.autolock.canais') || []
                
                let canaisadicionados = []
                let canaisnaoadicionados = []

                for (let canal of canais) {
                    if (!canaisdb.includes(canal)) {
                        canaisadicionados.push(canal)
                        canaisdb.push(canal)
                    } else {
                        canaisnaoadicionados.push(canal)
                    }
                }

                client.db.General.set('ConfigGeral.autolock.canais', canaisdb)

                await autolock(interaction, interaction.user.id, client, 1)
            }
            if (interaction.customId == 'removecanalautolock') {   
                let canais = interaction.values

                let canaisdb = client.db.General.get('ConfigGeral.autolock.canais') || []

                let canaisremovidos = []
                let canaisnaoremovidos = []

                for (let canal of canais) {
                    if (canaisdb.includes(canal)) {
                        canaisremovidos.push(canal)
                        canaisdb = canaisdb.filter(c => c !== canal)
                    } else {
                        canaisnaoremovidos.push(canal)
                    }
                }

                client.db.General.set('ConfigGeral.autolock.canais', canaisdb)

                await autolock(interaction, interaction.user.id, client, 1)
            }
        }
        if (interaction.isButton()) {

         
         
            if (interaction.customId == 'testarfechamento') {
                testarfechamento(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'definirimagemfechamento') {

                const modal = new ModalBuilder()
                    .setCustomId('imagemfechamento')
                    .setTitle('Imagem de Fechamento')

                const banner = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('banner')
                        .setLabel('BANNER DE FECHAMENTO (EMBED - URL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.image') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                const thumbnail = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('thumbnail')
                        .setLabel('THUMBNAIL DE FECHAMENTO (EMBED - URL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.thumbnail') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                const imagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('imagem')
                        .setLabel('IMAGEM DE FECHAMENTO (MENSAGEM - URL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.image') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(banner, thumbnail, imagem)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'definirimagemauth2') {

                const modal = new ModalBuilder()
                    .setCustomId('definirimagemauth2')
                    .setTitle('Imagem de OAuth2')

                const banner = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('banner')
                        .setLabel('BANNER (EMBED - URL)')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.banner') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                const thumbnail = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('thumbnail')
                        .setLabel('THUMBNAIL (EMBED - URL)')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.thumbnail') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                const imagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('imagem')
                        .setLabel('IMAGEM (MENSAGEM - URL)')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.contentimage') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(banner, thumbnail, imagem)
                await interaction.showModal(modal)
            }

            if (interaction.customId == 'setarembedfechamento') {
                
                const modal = new ModalBuilder()
                    .setCustomId('setarembedfechamento')
                    .setTitle('Embed de Fechamento')

                const title = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('TITULO DO EMBED')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.title') || 'Chat bloqueado!')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )

                const description = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('DESCRIÇÃO DO EMBED')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.description') || 'Chat bloqueado!')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )

                const color = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('color')
                        .setLabel('COR DO EMBED (OPCIONAL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.color') || '#ff0000')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(title, description, color)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'setarembedmensagemoauth2') {
                
                const modal = new ModalBuilder()
                    .setCustomId('setarembedmensagemoauth2')
                    .setTitle('Embed de OAuth2')

                const title = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('TITULO DO EMBED')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.title') || 'Autenticação OAuth2')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )

                const description = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('DESCRIÇÃO DO EMBED')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.description') || 'Por favor, autentique-se para acessar o chat.')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )

                const color = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('color')
                        .setLabel('COR DO EMBED (OPCIONAL)')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.color') || '#2b2d31')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(title, description, color)
                await interaction.showModal(modal)
            }

            if (interaction.customId == 'setarmensagemfechamento') {

                const modal = new ModalBuilder()
                    .setCustomId('mensagemfechamento')
                    .setTitle('Mensagem de Fechamento')

                const mensagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('mensagem')
                        .setLabel('MENSAGEM DE FECHAMENTO')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemfechamento.content') || 'Chat bloqueado!')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )

                modal.addComponents(mensagem)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'setarmensagemoauth2') {

                const modal = new ModalBuilder()
                    .setCustomId('setarmensagemoauth2')
                    .setTitle('Mensagem de OAuth2')

                const mensagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('mensagem')
                        .setLabel('CONTEÚDO DA MENSAGEM')
                        .setValue(client.db.General.get('ConfigGeral.MensagemOAuth2.content') || '')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )

                modal.addComponents(mensagem)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'limparmensagemfechamento') {
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.content')
                mensagemfechamento(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'limparembedfechamento') {
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.title')
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.description')
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.color')
                mensagemfechamento(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'limparimagemfechamento') {
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.banner')
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.thumbnail')
                client.db.General.delete('ConfigGeral.autolock.mensagemfechamento.contentimage')
                mensagemfechamento(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'mensagemfechamento') {
                mensagemfechamento(interaction, interaction.user.id, client)
            }
            // SISTEMA DE ABERTURA
            if (interaction.customId == 'testarbertura') {
                testarbertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'definirimagemabertura') {
                
                const modal = new ModalBuilder()
                    .setCustomId('imagemabertura')
                    .setTitle('Imagem de Abertura')

                const banner = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('banner')
                        .setLabel('BANNER DE ABERTURA (EMBED - URL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.image') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                const thumbnail = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('thumbnail')
                        .setLabel('THUMBNAIL DE ABERTURA (EMBED - URL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.thumbnail') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                const imagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('imagem')
                        .setLabel('IMAGEM DE ABERTURA (MENSAGEM - URL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.image') || '')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )


                modal.addComponents(banner, thumbnail, imagem)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'setarembedabertura') {
            
                const modal = new ModalBuilder()
                    .setCustomId('setarembedabertura')
                    .setTitle('Embed de Abertura')

                const title = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('TITULO DO EMBED')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.title') || 'Chat liberado!')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )

                const description = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('DESCRIÇÃO DO EMBED')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.description') || 'Chat liberado!')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )

                const color = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('color')
                        .setLabel('COR DO EMBED (OPCIONAL)')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.color') || '#00ff00')
                        .setRequired(false)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(title, description, color)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'setarmensagemabertura') {
            
                const modal = new ModalBuilder()
                    .setCustomId('mensagemabertura')
                    .setTitle('Mensagem de Abertura')

                const mensagem = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('mensagem')
                        .setLabel('MENSAGEM DE ABERTURA')
                        .setValue(client.db.General.get('ConfigGeral.autolock.mensagemabertura.content') || 'Chat liberado!')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                )

                modal.addComponents(mensagem)
                await interaction.showModal(modal)
            }
            if (interaction.customId == 'limparmensagemabertura') {
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.content')
                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'limparembedabertura') {
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.title')
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.description')
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.color')
                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'limparimagemabertura') {
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.banner')
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.thumbnail')
                client.db.General.delete('ConfigGeral.autolock.mensagemabertura.contentimage')
                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'mensagemabertura') {
                mensagemabertura(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'removercanalautolock') {

                let canais = client.db.General.get('ConfigGeral.autolock.canais') || []
                
                const select = new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId('removecanalautolock')
                        .setPlaceholder('Selecione canais para remover')
                        .setMaxValues(1)
                        .setMaxValues(canais.length)
                        .addChannelTypes(ChannelType.GuildText)
                    
                )

                const botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('returnautolock')
                        .setEmoji(`1237055536885792889`)
                        .setStyle(2)
                )

                interaction.update({ components: [select, botao] })
            }
            if (interaction.customId == 'adicionarcanalautolock') {

                const select = new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                        .setCustomId('addcanalautolock')
                        .setPlaceholder('Selecione canais para adicionar')
                        .setMaxValues(1)
                        .setMaxValues(5)
                        .addChannelTypes(ChannelType.GuildText)
                )

                const botao = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('returnautolock')
                        .setEmoji(`1237055536885792889`)
                        .setStyle(2)
                )

                interaction.update({ components: [select, botao] })
            }
            if (interaction.customId == 'returnacoesautomaticas') {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (interaction.user.id !== t) return 
                 acoesautomaticas(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'returnautolock') {
                autolock(interaction, interaction.user.id, client, 1)
            }
            if (interaction.customId == 'acoesautomaticas') {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (interaction.user.id !== t) return
                acoesautomaticas(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'autolock') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return interaction.deferUpdate()
                autolock(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ativarautolock') {
                if (client.db.General.get('ConfigGeral.autolock.status') != true) {
                    client.db.General.set('ConfigGeral.autolock.status', true)
                } else {
                    client.db.General.set('ConfigGeral.autolock.status', false)
                }
                autolock(interaction, interaction.user.id, client, 1)
            }
            if (interaction.customId == 'configurarautolock') {

                const modal = new ModalBuilder()
                    .setCustomId('horarioautolock')
                    .setTitle('Configuração de Horário')

                const fechamento = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('fechamento')
                        .setLabel('HORÁRIO DE FECHAMENTO')
                        .setValue(client.db.General.get('ConfigGeral.autolock.fechamento') || '19:00')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )
                const abertura = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('abertura')
                        .setLabel('HORÁRIO DE ABERTURA')
                        .setValue(client.db.General.get('ConfigGeral.autolock.abertura') || '09:00')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )
                const apagarmensagens = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('apagarmensagens')
                        .setLabel('APAGAR MENSAGENS AO TRANCAR?')
                        .setValue(client.db.General.get('ConfigGeral.autolock.apagarmensagens') === true ? 'Sim' : 'Nao')
                        .setPlaceholder('Sim/Nao')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )

                modal.addComponents(fechamento, abertura, apagarmensagens)
                await interaction.showModal(modal)
            }
        }
    }
}