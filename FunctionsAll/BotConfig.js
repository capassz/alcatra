
const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, StringSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require('../Handler/EmojiFunctions');

const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('permissionsmessage')


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

async function updateMessageConfig(interaction, user, client) {

    let status = client.db.General.get('ConfigGeral').Status
    let buttonColor
    let label
    let emoji

    if (status == 'ON') {
        status = `\`🟢 Ligado\``
        buttonColor = 4
        label = 'Desligar Vendas'
        emoji = "<:desligar:1238978047504547871>"
    } else if (status == 'OFF') {
        status = `\`🔴 Desligado\``
        buttonColor = 3;
        label = 'Ligar Vendas'
        emoji = "<:Ligado:1238977621220655125>"
    }

    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#2b2d31' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username} | Painel de Configuração`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Veja as informações do seu BOT abaixo!`)
        .setFields(
            { name: `Sistema de Vendas:`, value: `${status}`, inline: true },
            { name: `Versão:`, value: `\`1.0.0\``, inline: true },
            { name: `Ping:`, value: `\`${client.ws.ping} ms\``, inline: true },
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("vendastoggle")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("confirmpagament")
                .setLabel('Formas de Pagamento')
                .setEmoji(`1233103068942569543`)
                .setStyle(1),
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configdefinicoes")
                .setLabel('Definições')
                .setEmoji(`1233103066975309984`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("BlackListPainel")
                .setLabel('Personalizar BlackList')
                .setEmoji(`1237122937631408128`)
                .setStyle(2)
        )

    if (interaction.message == undefined) {
        await interaction.reply({ content: ``, embeds: [embed], components: [row, row2] }).then(async (u) => {
            createCollector(u);

            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            uu.set(lastMessage.id, user)
        }).catch(console.error);
    } else {
        var t = await uu.get(interaction.message.id)
        if (interaction.user.id !== t) return
        interaction.message.edit({ content: ``, embeds: [embed], components: [row, row2] }).then(async (u) => {
            createCollector(u);

        }).catch(console.error);
    }
}


async function definicoes(interaction, user, client) {

    const content = `O que precisa configurar?`

    const botao1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("configmoderacao")
            .setLabel('Moderação')
            .setEmoji(`1232782650385629299`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ButtonDuvidasPainel")
            .setLabel('Botão Dúvidas')
            .setEmoji(`1242899381330645095`)
            .setStyle(2),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("changetermos")
            .setLabel('Termos de compra')
            .setEmoji(`1234606184711979178`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("SaldoInvitePainel")
            .setLabel('Personalizar Invite')
            .setEmoji(`1233129471922540544`)
            .setStyle(2),
    )

    const botao2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("configbot")
            .setLabel('Configurar Bot')
            .setEmoji(`1233103066975309984`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("configchannels")
            .setLabel('Configurar Canais')
            .setEmoji(`1233127513178247269`)
            .setStyle(2)
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("acoesautomaticas")
            .setLabel('Ações Automáticas')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returnconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: content, embeds: [], components: [botao1, row2, botao2, row3] })

}

async function acoesautomaticas(interaction, user, client) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: `${client.user.username} | Painel de Ações Automáticas`, iconURL: `${client.user.displayAvatarURL()}` })
        .setColor('#2b2d31')
        .setDescription(`- Aqui você pode configurar as ações automáticas!`)


    const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("autolock")
            .setLabel('Auto-Lock')
            .setEmoji(`1244438113368150061`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("mensagemautogeral")
            .setLabel('Repostagem Automática')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("automsgggs")
            .setLabel('Mensagem Automática')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('returndefinicoesconfig')
            .setEmoji('1237055536885792889')
            .setStyle(2)
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [botao] })
}
async function autolock(interaction, user, client, a) {

    let status = client.db.General.get('ConfigGeral.autolock.status') == true ? 'ON' : 'OFF'
    let emoji
    let label
    let buttonColor

    if (status == 'ON') {
        status = `\`🟢 Ligado\``
        label = 'Desativar Auto-Lock'
        emoji = "<:desligar:1238978047504547871>"
        buttonColor = 4
    } else {
        status = `\`🔴 Desligado\``
        label = 'Ativar Auto-Lock'
        emoji = "<:Ligado:1238977621220655125>"
        buttonColor = 3
    }
    // client.db.General.get('ConfigGeral.autolock.abertura')
    let abertura = client.db.General.get('ConfigGeral.autolock.abertura') ? client.db.General.get('ConfigGeral.autolock.abertura') : 'Não definido'
    let fechamento = client.db.General.get('ConfigGeral.autolock.fechamento') ? client.db.General.get('ConfigGeral.autolock.fechamento') : 'Não definido'
    let canais = client.db.General.get('ConfigGeral.autolock.canais') || []

    const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({ name: `${client.user.username} | Painel de Auto-Lock`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`- Aqui você pode configurar o Auto-Lock!`)
        .setFields(
            { name: `Auto-Lock:`, value: `- Ao Ativar, o canal será bloqueado e desboqueado automaticamente.\n - **Sistema:** \`${status}\`\n- Horários:\n - **Abertura:** \`${abertura}\`\n - **Fechamento:** \`${fechamento}\``, inline: false }
        )

    if (canais.length > 0) {
        let canaisformatados = '';
        for (const canal of canais) {
            const canalObj = await client.channels.fetch(canal);
            canaisformatados += `- <#${canal}> | \`${canalObj.name}\`\n`;
        }
        embed.addFields({ name: 'Canais:', value: canaisformatados, inline: false });
    }

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ativarautolock")
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
        new ButtonBuilder()
            .setCustomId('configurarautolock')
            .setLabel('Programar Auto-Lock')
            .setEmoji(`1229787808936230975`)
            .setStyle(2),
    )

    const botoa2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("mensagemabertura")
            .setLabel('Mensagem de Abertura')
            .setEmoji(`1244437959915208775`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("mensagemfechamento")
            .setLabel('Mensagem de Fechamento')
            .setEmoji(`1244438113368150061`)
            .setStyle(2),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("adicionarcanalautolock")
            .setLabel('Adicionar Canal')
            .setEmoji(`1233110125330563104`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("removercanalautolock")
            .setLabel('Remover Canal')
            .setDisabled(canais.length == 0 ? true : false)
            .setEmoji(`1242907028079247410`)
            .setStyle(2),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    if (a != 1) {
        interaction.reply({ content: ``, embeds: [embed], components: [row, botoa2, row2], ephemeral: true })
    } else {
        interaction.update({ content: ``, embeds: [embed], components: [row, botoa2, row2] })
    }
}
async function mensagemabertura(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemabertura') || {};

    const {
        content = '',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
    } = mensagem;

    const embedexample = new EmbedBuilder()


    if (title !== 'Não definido') {
        embedexample.setTitle(title)
    }

    if (description !== 'Não definido') {
        embedexample.setDescription(description)
    }

    if (color !== 'Não definido') {
        embedexample.setColor(color)
    }

    if (banner !== 'Não definido') {
        embedexample.setImage(banner)
    }

    if (thumbnail !== 'Não definido') {
        embedexample.setThumbnail(thumbnail)
    }


    const embedprincipal = new EmbedBuilder()
        .setAuthor({ name: `Configuração Mensagem Abertura` })
        .setColor('#2b2d31')
        .setDescription(`- Aqui você pode configurar a mensagem de abertura!`)


    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarmensagemabertura')
            .setLabel('Definir Mensagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparmensagemabertura')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(content == '' ? true : false)
            .setStyle(4),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarembedabertura')
            .setLabel('Definir Embed')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparembedabertura')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(title == 'Não definido' ? true : false)
            .setStyle(4),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('definirimagemabertura')
            .setLabel('Definir Imagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparimagemabertura')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(contentimage != 'Não definido' || banner != 'Não definido' || thumbnail != 'Não definido' ? false : true)
            .setStyle(4),
    )

    const row5 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("testarbertura")
            .setLabel('Testar')
            .setEmoji(`1238978383845654619`)
            .setDisabled(title != 'Não definido' || content != '' || contentimage != 'Não definido' ? false : true)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("returnautolock")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )



    const updateOptions = {
        content: content !== '' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample, embedprincipal] : [embedprincipal],
        components: [row, row2, row3, row5],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.update(updateOptions);
}
async function mensagemfechamento(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemfechamento') || {};

    const {
        content = '',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
    } = mensagem;

    const embedexample = new EmbedBuilder()

    if (title !== 'Não definido') {
        embedexample.setTitle(title)
    }
    if (description !== 'Não definido') {
        embedexample.setDescription(description)
    }
    if (color !== 'Não definido') {
        embedexample.setColor(color)
    }
    if (banner !== 'Não definido') {
        embedexample.setImage(banner)
    }
    if (thumbnail !== 'Não definido') {
        embedexample.setThumbnail(thumbnail)
    }


    const embedprincipal = new EmbedBuilder()
        .setAuthor({ name: `Configuração Mensagem Fechamento` })
        .setColor('#2b2d31')
        .setDescription(`- Aqui você pode configurar a mensagem de fechamento!`)

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarmensagemfechamento')
            .setLabel('Definir Mensagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparmensagemfechamento')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(content == '' ? true : false)
            .setStyle(4),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('setarembedfechamento')
            .setLabel('Definir Embed')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparembedfechamento')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(title == 'Não definido' ? true : false)
            .setStyle(4),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('definirimagemfechamento')
            .setLabel('Definir Imagem')
            .setEmoji(`1237122937631408128`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('limparimagemfechamento')
            .setLabel('Limpar')
            .setEmoji(`1229787813046915092`)
            .setDisabled(contentimage != 'Não definido' || banner != 'Não definido' || thumbnail != 'Não definido' ? false : true)
            .setStyle(4),
    )

    const row5 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("testarfechamento")
            .setLabel('Testar')
            .setEmoji(`1238978383845654619`)
            .setDisabled(title != 'Não definido' || content != '' || contentimage != 'Não definido' ? false : true)
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId("returnautolock")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    const updateOptions = {
        content: content !== '' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample, embedprincipal] : [embedprincipal],
        components: [row, row2, row3, row5],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.update(updateOptions);
}
async function testarfechamento(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemfechamento') || {};

    const {
        content = 'Não definido',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
    } = mensagem;

    const embedexample = new EmbedBuilder()

    if (title !== 'Não definido') {
        embedexample.setTitle(title)
    }

    if (description !== 'Não definido') {
        embedexample.setDescription(description)
    }

    if (color !== 'Não definido') {
        embedexample.setColor(color)
    }

    if (banner !== 'Não definido') {
        embedexample.setImage(banner) 
    }

    if (thumbnail !== 'Não definido') {
        embedexample.setThumbnail(thumbnail)
    }

    const updateOptions = {
        content: content !== 'Não definido' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample] : [],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.reply(updateOptions);
}
async function testarbertura(interaction, user, client) {

    const mensagem = client.db.General.get('ConfigGeral.autolock.mensagemabertura') || {};

    const {
        content = 'Não definido',
        contentimage = 'Não definido',
        title = 'Não definido',
        description = 'Não definido',
        color = 'Não definido',
        banner = 'Não definido',
        thumbnail = 'Não definido',
    } = mensagem;

    const embedexample = new EmbedBuilder()

    if (title !== 'Não definido') {
        embedexample.setTitle(title)
    }

    if (description !== 'Não definido') {
        embedexample.setDescription(description)
    }

    if (color !== 'Não definido') {
        embedexample.setColor(color)
    }

    if (banner !== 'Não definido') {
        embedexample.setImage(banner)
    }

    if (thumbnail !== 'Não definido') {
        embedexample.setThumbnail(thumbnail)
    }

    const updateOptions = {
        content: content !== 'Não definido' ? content : '',
        embeds: title !== 'Não definido' ? [embedexample] : [],
        files: contentimage !== 'Não definido' ? [contentimage] : [],
        ephemeral: true
    };

    interaction.reply(updateOptions);
}
async function mensagemautogeral(interaction, user, client) {

    const repostagem = client.db.General.get(`ConfigGeral.repostagemautomatica.status`) == true ? `\`🟢 Ativado\`` : `\`🔴 Desativado\``
    const repostagemaoreiniciar = client.db.General.get(`ConfigGeral.repostagemautomatica.reiniciar`) == true ? `\`🟢 Ativado\`` : `\`🔴 Desativado\``
    let status = client.db.General.get('ConfigGeral.repostagemautomatica.status')
    let label
    let emoji
    let buttonColor

    if (status == true) {
        label = 'Desativar Repostagem'
        emoji = "<:desligar:1238978047504547871>"
        buttonColor = 4
    } else {
        label = 'Ativar Repostagem'
        emoji = "<:Ligado:1238977621220655125>"
        buttonColor = 3
    }


    let horario1formatado = client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`) ? `\`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario1`)}\` - ${client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario1`) ? `<t:${Math.floor(client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario1.hora`) / 1000)}:R>` : `\`Não Enviado\``}` : `\`Horário não definido.\``
    let horario2formatado = client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`) ? `\`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario2`)}\` - ${client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario2`) ? `<t:${Math.floor(client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario2.hora`) / 1000)}:R>` : `\`Não Enviado\``}` : `\`Horário não definido.\``
    let horario3formatado = client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`) ? `\`${client.db.General.get(`ConfigGeral.repostagemautomatica.horario3`)}\` - ${client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario3`) ? `<t:${Math.floor(client.db.General.get(`ConfigGeral.repostagemautomatica.ultimarepostagem_horario3.hora`) / 1000)}:R>` : `\`Não Enviado\``}` : `\`Horário não definido.\``


    const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({ name: `${client.user.username} | Painel de Repostagem`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`- Aqui você pode configurar a repostagem de mensagens!`)
        .setFields(
            { name: `Repostagem:`, value: `- Ao Ativar, a mensagem será respotada automaticamente no horário configurado.\n - **Sistema:** ${repostagem}`, inline: false },
            { name: `Repostagem Ao Reiniciar:`, value: `- Ao Ativar, a mensagem será repostada automaticamente ao reiniciar o bot.\n - **Sistema:** ${repostagemaoreiniciar}`, inline: false },
            { name: `Horários de Repostagem:`, value: `- ${horario1formatado}\n- ${horario2formatado}\n- ${horario3formatado} `, inline: false }
        )

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ativarrepostagem")
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
        new ButtonBuilder()
            .setCustomId("reenviarmensagens")
            .setLabel('Reenviar Mensagens')
            .setEmoji(`1237122935437656114`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("configurarrepostagem")
            .setLabel('Repostagem')
            .setEmoji(`1229787808936230975`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("configprodutosrespotar")
            .setLabel('Produtos a Repostar')
            .setEmoji(`1242666444051976298`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returnacoesautomaticas")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] })
}
async function configprodutosrespotar(interaction, user, client) {

    let quantidade

    if (!client.db.General.get(`ConfigGeral.produtosrespostar`)) {
        quantidade = 0
    } else {
        quantidade = client.db.General.get(`ConfigGeral.produtosrespostar`).length
    }

    let produtosrespostar = quantidade == 0 ? `Todos os produtos serão repostados.` : `Produtos configurados: (\`${quantidade}\`)`

    const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({ name: `${client.user.username} | Painel de Produtos`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`- Aqui você pode configurar os produtos que serão repostados!`)
        .setFields(
            { name: `Produtos:`, value: `${produtosrespostar}`, inline: false }
        )

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("adicionarprodutos")
            .setLabel('Adicionar Produtos')
            .setEmoji(`1233110125330563104`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("removerprodutos")
            .setLabel('Remover Produtos')
            .setEmoji(`1242907028079247410`)
            .setDisabled(quantidade == 0 ? true : false)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returnmensagemautogeral")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] })
}
async function adicionarprodutosrepostar(interaction, user, client) {

    let produtoscadastrados = client.db.produtos.fetchAll();
    let selects = [];
    const produtosPorSelect = 25;

    while (produtoscadastrados.length > 0) {
        const opcoes = produtoscadastrados.splice(0, Math.min(produtosPorSelect, produtoscadastrados.length)).map(element => {
            const name = (element.data.settings.name.length > 15) ? `${element.data.settings.name.slice(0, 15)}...` : element.data.settings.name;
            return {
                label: `ID: ${element.ID.split('_')[0]} | NOME: ${name}`,
                value: `${element.ID}`,
                emoji: `1233110125330563104`
            };
        });

        const select = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: `adicionarprodutosrepostar_${selects.length}`,
                    options: opcoes,
                    placeholder: 'Selecione os produtos',
                    min_values: 1,
                    max_values: opcoes.length
                }
            ]
        };

        selects.push(select);
    }

    const botao = {
        type: 1,
        components: [
            {
                type: 2,
                style: 2,
                custom_id: 'returnconfigprodutosrespotar',
                emoji: { id: '1237055536885792889', name: null, animated: false }
            }
        ]
    };

    selects.push(botao);


    interaction.update({ components: selects, ephemeral: true })
}
async function removerprodutosrepostar(interaction, user, client) {

    let produtoscadastrados = client.db.General.get(`ConfigGeral.produtosrespostar`);
    let selects = [];
    const produtosPorSelect = 25;

    while (produtoscadastrados.length > 0) {
        const opcoes = produtoscadastrados.splice(0, Math.min(produtosPorSelect, produtoscadastrados.length)).map(element => {
            const name = (element.name.length > 15) ? `${element.name.slice(0, 15)}...` : element.name;
            return {
                label: `ID: ${element.id.split('_')[0]} | NOME: ${name}`,
                value: `${element.id}`,
                emoji: `1242907028079247410`
            };
        });

        const select = {
            type: 1,
            components: [
                {
                    type: 3,
                    custom_id: `removerprodutosrepostar_${selects.length}`,
                    options: opcoes,
                    placeholder: 'Selecione os produtos',
                    min_values: 1,
                    max_values: opcoes.length
                }
            ]
        };

        selects.push(select);
    }


    const botao = {
        type: 1,
        components: [
            {
                type: 2,
                style: 2,
                custom_id: 'returnconfigprodutosrespotar',
                emoji: { id: '1237055536885792889', name: null, animated: false }
            }
        ]
    };

    selects.push(botao);

    interaction.update({ components: selects, ephemeral: true })
}
async function configmoderacao(interaction, user, client) {

    let status = client.db.General.get('ConfigGeral.Status')
    if (status == 'ON') {
        status = `\`🟢 Ligado\``
    } else if (status == 'OFF') {
        status = `\`🔴 Desligado\``
    }

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: `${client.user.username} | Painel de Moderação`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Selecione o Sistema que Deseja configurar:`)
        .setFields(
            { name: `Sistema de Vendas:`, value: `${status}`, inline: true },
            { name: `Versão:`, value: `\`1.0.0\``, inline: true },
            { name: `Ping:`, value: `\`${client.ws.ping} ms\``, inline: true },
        )


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("autorole")
                .setLabel('Sistema de AutoRole')
                .setEmoji(`1233127515141308416`)
                .setStyle(2),
        )
    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("boasveindas")
            .setLabel('Sistema de Boas Vindas')
            .setEmoji(`1242906307443560448`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("systemantifake")
            .setLabel('Sistema de Anti-Fake')
            .setEmoji(`1242906307443560448`)
            .setStyle(2),
    )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row, row2, row3] })
}
function BlackListPainel(interaction, client) {

    const ss = client.db.blacklist.fetchAll()

    if (ss.length <= 0) {
        client.db.blacklist.set(`BlackList.users`, [])
    }

    var fff = ``

    for (let i = 0; i < ss.length; i++) {
        const element = ss[i];
        const dd2 = element.data.users
        for (let iiiiii = 0; iiiiii < dd2.length; iiiiii++) {
            const element2 = dd2[iiiiii];
            if (element.data.users == 0) {

            } else {
                fff += `**ID: ${iiiiii + 1}** - <@${element2}> \`(${element2})\`\n`
            }
        }

    }

    if (fff !== ``) {
        fff = `Usuários que estão na BlackList:\n\n${fff}`
    } else {
        fff = `Nenhum usuário se encontra na BlackList!`
    }

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Painel BlackList`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${fff}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("AdicionarNaBlacklist")
                .setLabel('Adicionar Membro na Black-List')
                .setEmoji(`1233110125330563104`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("RemoverNaBlacklist")
                .setLabel('Remover Membro na Black-List')
                .setEmoji(`1242907028079247410`)
                .setStyle(4),
            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] })
}
function SaldoInvitePainel(interaction, client) {

    let status = client.db.General.get('ConfigGeral.Convites.Status') ? 'ON' : 'OFF'
    let emoji
    let label
    let buttonColor

    if (status == 'ON') {
        status = `\`🟢 Ligado\``
        emoji = "<:desligar:1238978047504547871>"
        label = 'Desligar Convites'
        buttonColor = 4
    } else if (status == 'OFF') {
        status = `\`🔴 Desligado\``
        emoji = "<:Ligado:1238977621220655125>"
        label = 'Ligar Convites'
        buttonColor = 3
    }

    let CargoExpecificoConvite = client.db.General.get(`ConfigGeral.Convites.Cargo`) == null ? `\`Todos\`` : `<@&${client.db.General.get(`ConfigGeral.Convites.Cargo`)}>`
    let qtdinvitesresgatarsaldo = Number(client.db.General.get('ConfigGeral.Convites.qtdinvitesresgatarsaldo') == null ? 2 : client.db.General.get('ConfigGeral.Convites.qtdinvitesresgatarsaldo'))
    let QuantoVaiGanharPorInvites = Number(client.db.General.get('ConfigGeral.Convites.QuantoVaiGanharPorInvites') == null ? 0.10 : client.db.General.get('ConfigGeral.Convites.QuantoVaiGanharPorInvites')).toFixed(2)

    qtdinvitesresgatarsaldo = Number(qtdinvitesresgatarsaldo)
    QuantoVaiGanharPorInvites = Number(QuantoVaiGanharPorInvites).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Painel Invite`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Selecione o Sistema que Deseja configurar:`)
        .setFields(
            { name: `Cargo Expecifico:`, value: `${CargoExpecificoConvite}`, inline: false },
            { name: `Sistema de Convites:`, value: `${status}`, inline: false },
            { name: `Invites para Ganhar Saldo:`, value: `\`${qtdinvitesresgatarsaldo}\``, inline: false },
            { name: `Ganhar por Invite:`, value: `\`${QuantoVaiGanharPorInvites}\``, inline: false },
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("CargoExpecificoConvite")
                .setLabel('Cargo Especifico')
                .setEmoji(`1233127515141308416`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("SaldoporInvite")
                .setLabel('Saldo por Invite')
                .setEmoji(`1242917506247692491`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("QuantosInvitesParaGanharSaldo")
                .setLabel('Quantos Invites')
                .setEmoji(`1243254225799217172`)
                .setStyle(2),
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("StatusConvites")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("ResetarConvites")
                .setLabel('Resetar Configurações')
                .setEmoji(`1237122940617883750`)
                .setStyle(4),
            new ButtonBuilder()
                .setCustomId("returndefinicoesconfig")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row, row2] })

}

async function UpdateStatusVendas(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const currentStatus = client.db.General.get(`ConfigGeral.Status`);
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    client.db.General.set(`ConfigGeral.Status`, newStatus);

    updateMessageConfig(interaction, user, client)
}

async function UpdatePagamento(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    let status = client.db.General.get('ConfigGeral').Status

    if (status == 'ON') {
        status = `\`🟢 Ligado\``
    } else if (status == 'OFF') {
        status = `\`🔴 Desligado\``
    }

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ iconURL: `${client.user.displayAvatarURL()}`, name: `${client.user.username} | Painel Pagamento` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Selecione o Sistema que Deseja configurar:`)
        .setFields(
            { name: `Sistema de Vendas:`, value: `${status}`, inline: true },
            { name: `Versão:`, value: `\`1.0.0\``, inline: true },
            { name: `Ping:`, value: `\`${client.ws.ping} ms\``, inline: true },
        )


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ConfigMP")
                .setLabel('Mercado Pago')
                .setEmoji(`1233188498287104030`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("ConfigSaldo")
                .setLabel('Saldo')
                .setEmoji(`1242917506247692491`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigSemiAuto")
                .setLabel('Pagamento Semiauto')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ConfigCashBack")
                .setLabel('Sistema Cashback')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )



    interaction.message.edit({ content: ``, embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}


async function blockbank(interaction, user, client) {

    let config = {
        method: 'GET',
        headers: {
            'Authorization': 'SUASENHA',
            'Content-Type': 'application/json'
        }
    }

    let bancosfraudulentos = await fetch('https://dev.promisse.app/blacklist/get', config)
    bancosfraudulentos = await bancosfraudulentos.json()

    let opcoes = []

    for (let banco in bancosfraudulentos) {
        let quantidade = bancosfraudulentos[banco].quantidade
        let valorTotal = bancosfraudulentos[banco].valorTotal

        opcoes.push({
            label: banco,
            description: `${(quantidade)} Fraudes, total de ${Number(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
            value: banco
        })
    }

    const content = `Não se preocupe, no momento em que uma fraude é detectada em um novo banco em qualquer loja, ele é adicionado automaticamente aqui. `

    const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("blockbank")
            .setPlaceholder('Selecione o Banco que deseja bloquear')
            .setMinValues(1)
            .setMaxValues(opcoes.length)
            .addOptions(opcoes)
    .setPlaceholder('Selecione os bancos que deseja bloquear')
               .addOptions([
                 {
                   label: 'Banco Inter S.A.',
                   emoji: '🇧🇷',
                   value: 'inter'
                 },
                 {
                   label: 'Banco Bradesco S.A.',
                   emoji: '🇧🇷',
                   value: 'bradesco'
                 },
                 {
                   label: 'Nu Pagamentos S.A.',
                   emoji: '🇧🇷',
                   value: 'nu'
                 },
                 {
                   label: 'Banco do Brasil S.A.',
                   emoji: '🇧🇷',
                   value: 'brasil'
                 },
                 {
                   label: 'Banco Itaucard S.A.',
                   emoji: '🇧🇷',
                   value: 'itaucard'
                 },
               ])
               .setMaxValues(5)
               .setMinValues(1)
            )

    const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returnConfigMP")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: content, embeds: [], components: [select, botao] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}
async function unlockbank(interaction, user, client) {

    let config = {
        method: 'GET',
        headers: {
            'Authorization': 'SUASENHA',
            'Content-Type': 'application/json'
        }
    }

    let bancosfraudulentos = await fetch('https://dev.promisse.app/blacklist/get', config)
    bancosfraudulentos = await bancosfraudulentos.json()

    let bancosbloqueados = client.db.General.get('ConfigGeral.BankBlock') || []

    let opcoes = []

    for (let banco of bancosbloqueados) {
        if (bancosfraudulentos[banco]) {
            let quantidade = bancosfraudulentos[banco].quantidade
            let valorTotal = bancosfraudulentos[banco].valorTotal

            opcoes.push({
                label: banco,
                description: `${quantidade} Fraudes, total de ${Number(valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                value: banco
            })
        }
    }


    const select = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("unlockbank")
            .setPlaceholder('Selecione o Banco que deseja desbloquear')
            .addOptions(opcoes)
            .setPlaceholder('Selecione os bancos que deseja bloquear')
            .addOptions([
              {
                label: 'Banco Inter S.A.',
                emoji: '🇧🇷',
                value: 'inter'
              },
              {
                label: 'Banco Bradesco S.A.',
                emoji: '🇧🇷',
                value: 'bradesco'
              },
              {
                label: 'Nu Pagamentos S.A.',
                emoji: '🇧🇷',
                value: 'nu'
              },
              {
                label: 'Banco do Brasil S.A.',
                emoji: '🇧🇷',
                value: 'brasil'
              },
              {
                label: 'Banco Itaucard S.A.',
                emoji: '🇧🇷',
                value: 'itaucard'
              },
            ])
            .setMaxValues(5)
            .setMinValues(1)
         )

    if (opcoes.length > 1) {
        select.components[0].setMaxValues(opcoes.length)
    }

    const botao = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returnConfigMP")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ embeds: [], components: [select, botao] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}
async function ConfigMP(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const status = client.db.General.get('ConfigGeral').MercadoPagoConfig.PixToggle


    let buttonColor
    let labelpix
    let emojipix

    if (status == 'ON') {
        buttonColor = 4
        labelpix = 'Desligar Pix'
        emojipix = "<:desligar:1238978047504547871>"
    } else if (status == 'OFF') {
        buttonColor = 3
        labelpix = 'Ativar Pix'
        emojipix = "<:Ligado:1238977621220655125>"
    }

    const status2 = client.db.General.get('ConfigGeral').MercadoPagoConfig.SiteToggle


    let buttonColor2
    let labelsite
    let emojisite

    if (status2 == 'ON') {
        buttonColor2 = 4
        labelsite = 'Desligar Site'
        emojisite = "<:desligar:1238978047504547871>"

    } else if (status2 == 'OFF') {
        buttonColor2 = 3
        labelsite = 'Ativar Site'
        emojisite = "<:Ligado:1238977621220655125>"
    }

    let tokenmpformatado = client.db.General.get('ConfigGeral.MercadoPagoConfig.TokenAcessMP') != "" ? `${(client.db.General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP).substring(0, 24)}********************************` : 'Não configurado...'
    let bancosbloqueados = client.db.General.get('ConfigGeral.BankBlock') || []
    let bancos = bancosbloqueados.length == 0 ? `Nenhum banco bloqueado.` : bancosbloqueados.join('\n')
    let metodopagamento = status == 'ON' && status2 == 'ON' ? `- \`Pix\` - Checkout transparente\n- \`Site\` - Checkout transparente` : status == 'ON' ? `- \`Pix\` - Checkout transparente` : status2 == 'ON' ? `- \`Site\` - Checkout transparente` : `\`Nenhum método de pagamento configurado.\``


    const embed = new EmbedBuilder()
        .setTitle(`Configurar Mercado Pago - ${status == 'ON' || status2 == 'ON' ? `HABIILITADO` : `DESABILITADO`}`)
        .setColor(`#2b2d31`)
        .setDescription(`Aqui, você pode configurar tudo referente ao Mercado Pago. Pode definir ou redefinir seu access token, vincular seu mercado pago caso seja de menor e queira fazer vendas automáticas, bloquear ou desbloquear bancos que não deseja aceitar pagamentos e editar as formas de pagamento que serão aceitas por ele.`)
        .setFields(
            { name: `Mercado Pago Access Token`, value: `\`\`\`${tokenmpformatado}\`\`\`` },
            { name: `Métodos De Pagamento`, value: `${metodopagamento}`, inline: false },
            { name: `Bancos Bloqueados`, value: `\`\`\`${bancos}\`\`\``, inline: false },
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("PixMPToggle")
                .setLabel(labelpix)
                .setEmoji(emojipix)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("SiteMPToggle")
                .setLabel(labelsite)
                .setEmoji(emojisite)
                .setStyle(buttonColor2),
            new ButtonBuilder()
                .setCustomId("TimePagament")
                .setLabel('Tempo para Pagar')
                .setEmoji(`1229787808936230975`) // 1229787808936230975
                .setStyle(2),
        )

    const botao2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("TokenAcessMP")
            .setLabel('Autorizar')
            .setEmoji(`1237122935437656114`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("blockbank")
            .setLabel('Bloquear Banco')
            .setEmoji(`1233110125330563104`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("unlockbank")
            .setLabel('Desbloquear Banco')
            .setEmoji(`1229787813046915092`)
            .setDisabled(bancosbloqueados.length == 0 ? true : false)
            .setStyle(2),
    )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )


    interaction.message.edit({ embeds: [embed], components: [row, botao2, row2], content: `` }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);

}

async function ToggeMP(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'PixMPToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = client.db.General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.MercadoPagoConfig.PixToggle`, newStatus);
        ConfigMP(interaction, user, client)
    }
    if (interaction.customId == 'SiteMPToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = client.db.General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.MercadoPagoConfig.SiteToggle`, newStatus);
        ConfigMP(interaction, user, client)
    }

    if (interaction.customId == 'TimePagament') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('timeMP')
            .setTitle(`Alterar Tempo`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('timeMP')
            .setLabel("TEMPO: (ENTRE 5 A 20 MINUTOS)")
            .setPlaceholder("10")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(256)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);
    }

    if (interaction.customId == 'TokenAcessMP') {
        interaction.deferUpdate()
        var t = await uu.get(interaction.message.id)
        if (interaction.user.id !== t) return

        const fernandona = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("+18porra")
                    .setLabel('Setar AcessToken')
                    .setEmoji(`1237122937631408128`)
                    .setStyle(1),
                new ButtonBuilder()
                    .setCustomId("-18porra")
                    .setLabel('Autenticar MercadoPago [-18]')
                    .setEmoji(`1190793840697806855`)
                    .setStyle(2),
                new ButtonBuilder()
                    .setCustomId("voltar1234sda")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)

            )

        interaction.message.edit({ content: ``, embeds: [], components: [fernandona] })
    }
}

async function TimeMP(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'timeMP') {
        const NewTime = interaction.fields.getTextInputValue('timeMP');

        if (/^\d+$/.test(NewTime)) {

            client.db.General.set(`ConfigGeral.MercadoPagoConfig.TimePagament`, NewTime)

            ConfigMP(interaction, user, client)
            interaction.deferUpdate()
        } else {
            interaction.reply({ content: `NEGADO: você inseriu em seus VALORES alguma letra`, ephemeral: true })
            return
        }
    }
    const mercadopago = require('mercadopago')

    if (interaction.customId === 'tokenMP') {
        const tokenMP = interaction.fields.getTextInputValue('tokenMP');

        try {
            const payment_data = {
                transaction_amount: 10,
                description: 'Testando se o token é Válido | Rare Apps',
                payment_method_id: 'pix',
                payer: {
                    email: 'PromisseSolutionsrecebimentos@gmail.com',
                    first_name: 'Victor André',
                    last_name: 'Ricardo Almeida',
                    identification: {
                        type: 'CPF',
                        number: '15084299872',
                    },
                    address: {
                        zip_code: '86063190',
                        street_name: 'Rua Jácomo Piccinin',
                        street_number: '971',
                        neighborhood: 'Pinheiros',
                        city: 'Londrina',
                        federal_unit: 'PR',
                    },
                },
            };

            mercadopago.configurations.setAccessToken(tokenMP);
            await mercadopago.payment.create(payment_data);


        } catch (error) {

            await interaction.reply({
                content: `⚠️ | Access Token inválido!\n${error}\n\n> Tutorial para pegar o Access Token: [CliqueAqui](https://www.youtube.com/watch?v=w7kyGZUrkVY&feature=youtu.be)\n> Lembre-se de cadastrar uma chave pix na sua conta mercado pago!`,
                ephemeral: true,
            });

            return
        }

        interaction.deferUpdate()
        ConfigMP(interaction, user, client)
        client.db.General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`, tokenMP);
        client.db.General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessIdade`, 'maior');

    }


}

async function ConfigSaldo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    let statussaldo = client.db.General.get('ConfigGeral').SaldoConfig.SaldoStatus == 'ON' ? '\`🟢 Ativado\`' : '\`🔴 Desativado\`'
    let bonusSaldo = client.db.General.get('ConfigGeral').SaldoConfig.Bonus
    let valorMinimo = Number(client.db.General.get('ConfigGeral').SaldoConfig.ValorMinimo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Painel Saldo`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Configurações do Saldo:`)
        .setFields(
            { name: `Sistema de Saldo:`, value: `${statussaldo}`, inline: false },
            { name: `Bônus por depósito:`, value: `\`${bonusSaldo}%\``, inline: false },
            { name: `Valor mínimo para depósito:`, value: `\`${valorMinimo}\``, inline: false }
        )

    const status = client.db.General.get('ConfigGeral').SaldoConfig.SaldoStatus
    let buttonColor
    let label
    let emoji
    if (status == 'ON') {
        buttonColor = 4
        label = 'Desligar Saldo'
        emoji = "<:desligar:1238978047504547871>"
    } else if (status == 'OFF') {
        buttonColor = 3
        label = 'Ativar Saldo'
        emoji = "<:Ligado:1238977621220655125>"
    }

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("SaldoToggle")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("BonusChange")
                .setLabel('Bônus por Depósito')
                .setEmoji(`1242904983343468574`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function ToggleSaldo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'SaldoToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = client.db.General.get(`ConfigGeral.SaldoConfig.SaldoStatus`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.SaldoConfig.SaldoStatus`, newStatus);
        ConfigSaldo(interaction, user, client)

    }

    if (interaction.customId == 'BonusChange') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('bonusSaldo')
            .setTitle(`💰 | Bônus por depósito`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('bonusSaldo')
            .setLabel("PORCENTAGEM DO BÔNUS")
            .setPlaceholder("10")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(3)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('bonusPorcent')
            .setLabel("VALOR MÍNIMO DE DEPÓSITO")
            .setPlaceholder("5")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(3)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
        modalaAA.addComponents(firstActionRow3, firstActionRow2);
        await interaction.showModal(modalaAA);

    }
}

async function bonusSaldo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'bonusSaldo') {

        const bonusSaldo = interaction.fields.getTextInputValue('bonusSaldo');
        const bonusPorcent = interaction.fields.getTextInputValue('bonusPorcent');
        const hasLetters1 = /[a-zA-Z]/.test(bonusSaldo);
        const hasLetters2 = /[a-zA-Z]/.test(bonusPorcent);

        if (hasLetters1 || hasLetters2) {
            interaction.reply({ content: `ERROR: você inseriu em seus VALORES alguma letra`, ephemeral: true });
            return;
        }

        if (bonusSaldo > 100) {
            interaction.reply({ content: `ERROR: você não pode inserir valor MAIOR que 100`, ephemeral: true });
            return;
        }

        client.db.General.set(`ConfigGeral.SaldoConfig.ValorMinimo`, bonusPorcent);
        client.db.General.set(`ConfigGeral.SaldoConfig.Bonus`, bonusSaldo);
        ConfigSaldo(interaction, user, client);
        interaction.reply({ content: `✅ | Bônus por depósito: ${bonusSaldo}%\n✅ | Valor mínimo de depósito: R$${bonusPorcent}`, ephemeral: true });
    }
}

async function ConfigSemiAuto(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    let status2 = client.db.General.get('ConfigGeral').SemiAutoConfig.SemiAutoStatus
    let buttonColor2
    let label
    let emoji

    if (status2 == 'ON') {
        status2 = `\`🟢 Ativado\``
        buttonColor2 = 4
        label = 'Desligar Semi'
        emoji = "<:desligar:1238978047504547871>"

    } else if (status2 == 'OFF') {
        status2 = `\`🔴 Desativado\``
        buttonColor2 = 3
        label = 'Ativar Semi'
        emoji = "<:Ligado:1238977621220655125>"
    }

    let chavePix = client.db.General && client.db.General.get('ConfigGeral') ? client.db.General.get('ConfigGeral').SemiAutoConfig.pix || 'Não Configurado' : 'Não Configurado'
    let qrcode = client.db.General.get('ConfigGeral').SemiAutoConfig.qrcode ? `[Qr Code](${client.db.General && client.db.General.get('ConfigGeral').SemiAutoConfig.qrcode})` : '\`Não Configurado...\`'

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Painel SemiAutomático`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Configurações do Sistema:`)
        .setFields(
            { name: `Sistema SemiAuto:`, value: `${status2}`, inline: false },
            { name: `Chave Pix:`, value: `\`${chavePix}\``, inline: false },
            { name: `Qr Code:`, value: qrcode, inline: false }
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("SemiautoToggle")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("SemiautoPix")
                .setLabel('Chave Pix')
                .setEmoji(`1233188452330373142`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("Semiautoqrcode")
                .setLabel('Qr Code')
                .setEmoji(`1242663891868057692`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function ToggleSemiAuto(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'SemiautoToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = client.db.General.get(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        client.db.General.set(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`, newStatus);
        ConfigSemiAuto(interaction, user, client)

    }
    if (interaction.customId == 'SemiautoPix') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('SemiautoPix')
            .setTitle(`Alterar Chave Pix`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('TypePix')
            .setLabel("TIPO DA CHAVE:")
            .setPlaceholder("Email, Cpf, Aleatória, ETC.")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('Pix')
            .setLabel("CHAVE:")
            .setPlaceholder("JoãozinhoDev@gmail.com")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
        modalaAA.addComponents(firstActionRow3, firstActionRow2);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'Semiautoqrcode') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('Semiautoqrcode')
            .setTitle(`Alterar QR CODE`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('Semiautoqrcode')
            .setLabel("LINK QRCODE:")
            .setPlaceholder("Link do QRCODE.")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }
}

async function PixChangeSemiAuto(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'SemiautoPix') {

        const TypePix = interaction.fields.getTextInputValue('TypePix');
        const Pix = interaction.fields.getTextInputValue('Pix');

        client.db.General.set(`ConfigGeral.SemiAutoConfig.typepix`, TypePix);
        client.db.General.set(`ConfigGeral.SemiAutoConfig.pix`, Pix);
        interaction.deferUpdate()
        ConfigSemiAuto(interaction, user, client);
    }

    if (interaction.customId === 'Semiautoqrcode') {

        const Semiautoqrcode = interaction.fields.getTextInputValue('Semiautoqrcode');

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(Semiautoqrcode)) {
            client.db.General.set(`ConfigGeral.SemiAutoConfig.qrcode`, Semiautoqrcode);
            interaction.deferUpdate()
        } else {
            interaction.reply({ content: `ERROR: Você inseriu um LINK de imagem QRCODE invalido`, ephemeral: true });
        }
        ConfigSemiAuto(interaction, user, client);
    }
}


async function configbot(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Painel BOT`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Configurações do BOT:`)
        .setFields(
            { name: `Cor Padrão`, value: `${client.db.General.get('ConfigGeral').ColorEmbed}`, inline: false },
            { name: `Banner Default`, value: `${client.db.General.get('ConfigGeral.BannerEmbeds') == null ? `\`Não definido...\`` : `[Banner](${client.db.General.get('ConfigGeral.BannerEmbeds')})`}`, inline: false },
            { name: `Miniatura Default`, value: `${client.db.General.get('ConfigGeral.MiniaturaEmbeds') == null ? `\`Não definido...\`` : `[Miniatura](${client.db.General.get('ConfigGeral.MiniaturaEmbeds')})`}`, inline: false },
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeName")
                .setLabel('Alterar Nome')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ChangeAvatar")
                .setLabel('Alterar Avatar')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("ChangeColorBOT")
                .setLabel('Alterar Cor Padrão do bot')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
        )


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeStatusBOT")
                .setLabel('Alterar o Status do bot')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("AlterarBanner")
                .setLabel('Alterar Banner')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("AlterarMiniatura")
                .setLabel('Alterar Miniatura')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
        )

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2)
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row, row2, row3] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function configbotToggle(interaction, user, client) {

    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return interaction.deferUpdate()

    if (interaction.customId == 'ChangeName') {

        const modalaAA = new ModalBuilder()
            .setCustomId('newnamebot')
            .setTitle(`Alterar Nome Do BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('newnamebot')
            .setLabel("NOVO NOME:")
            .setPlaceholder("Novo Nome")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeAvatar') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeAvatar')
            .setTitle(`Alterar Avatar Do BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('ChangeAvatar')
            .setLabel("LINK AVATAR:")
            .setPlaceholder("NOVO AVATAR")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeColorBOT') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeColorBOT')
            .setTitle(` | Alterar COR do seu BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('ChangeColorBOT')
            .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
            .setPlaceholder("#FF0000, #FF69B4, #FF1493")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'AlterarBanner') {

        const modalaAA = new ModalBuilder()
            .setCustomId('AlterarBanner')
            .setTitle(` | Alterar Banner do Painel`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('editpainelBanner')
            .setLabel("LINK BANNER:")
            .setPlaceholder("NOVO BANNER")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId.startsWith('AlterarMiniatura')) {
        const t = await uu.get(interaction.message.id)
        const modalaAA = new ModalBuilder()
            .setCustomId('AlterarMiniatura')
            .setTitle(` | Alterar Miniatura do Painel`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('AlterarMiniatura')
            .setLabel("LINK DA MINIATURA:")
            .setPlaceholder("NOVO MINIATURA")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeStatusBOT') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeStatusBOT')
            .setTitle(`Alterar Status do seu BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('typestatus')
            .setLabel("ESCOLHA O TIPO DE PRESENÇA:")
            .setPlaceholder("Online, Ausente, Invisivel ou Não Pertubar")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('ativistatus')
            .setLabel("ESCOLHA O TIPO DE ATIVIDADE:")
            .setPlaceholder("Jogando, Assistindo, Competindo, Transmitindo, Ouvindo")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN3 = new TextInputBuilder()
            .setCustomId('textstatus')
            .setLabel("ESCREVA O TEXTO DA ATIVIDADE:")
            .setPlaceholder("Vendas Automáticas")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN4 = new TextInputBuilder()
            .setCustomId('urlstatus')
            .setLabel("URL DO CANAL:")
            .setPlaceholder("Se a escolha foi Transmitindo, Coloque a Url aqui, ex: https://www.twitch.tv/joaozinho231")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
        const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);
        const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN4);
        modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
        await interaction.showModal(modalaAA);

    }

}

async function FunctionCompletConfig(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'newnamebot') {
        const newnamebot = interaction.fields.getTextInputValue('newnamebot');
        try {
            await client.user.setUsername(newnamebot)
            configbot(interaction, user, client)
            interaction.deferUpdate()
        } catch (error) {
            interaction.reply({ ephemeral: true, content: `ERROR: Sua alteração de NOME falhou, Possiveis motivos: Nome inapropriado, Maximo de caracterias, Nome Generico, Alteração Recente;` })
        }
    }

    if (interaction.customId === 'ChangeAvatar') {
        const ChangeAvatar = interaction.fields.getTextInputValue('ChangeAvatar');

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(ChangeAvatar)) {
            try {
                await client.user.setAvatar(`${ChangeAvatar}`)
                interaction.reply({ ephemeral: true, content: `CERTO: você alterou o AVATAR de seu BOT.` })
                configbot(interaction, user, client)
            } catch (error) {
                interaction.reply({ ephemeral: true, content: `ERROR: ocorreu algum erro interno na API do BOT, ou você está alterando muito rapidamente o seu AVATAR.;` })
            }
        } else {
            interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu um AVATAR invalido para seu BOT;` })
        }
    }
    if (interaction.customId === 'ChangeColorBOT') {
        const ChangeColorBOT = interaction.fields.getTextInputValue('ChangeColorBOT');

        var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        var isHexadecimal = regex.test(ChangeColorBOT);

        if (isHexadecimal) {

            client.db.General.set(`ConfigGeral.ColorEmbed`, ChangeColorBOT)
            configbot(interaction, user, client)
            interaction.deferUpdate()
        } else {
            interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu um COR diferente de HexaDecimal;` })
        }
    }

    if (interaction.customId === 'AlterarMiniatura') {

        const AlterarMiniatura = interaction.fields.getTextInputValue('AlterarMiniatura');

        if (AlterarMiniatura == ``) {
            client.db.General.delete(`ConfigGeral.MiniaturaEmbeds`)
            configbot(interaction, user, client)
            return
        }

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(AlterarMiniatura)) {

            interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou a MINIATURA do seu Produto.` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
            client.db.General.set(`ConfigGeral.MiniaturaEmbeds`, AlterarMiniatura)
            configbot(interaction, user, client)
        } else {
            interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu uma MINIATURA invalido para seu BOT;` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
        }

    }

    if (interaction.customId === 'AlterarBanner') {
        const AlterarBanner = interaction.fields.getTextInputValue('editpainelBanner');

        if (AlterarBanner == ``) {
            client.db.General.delete(`ConfigGeral.BannerEmbeds`)
            configbot(interaction, user, client)
            return
        }

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(AlterarBanner)) {

            interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou o BANNER do seu BOT.` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
            client.db.General.set(`ConfigGeral.BannerEmbeds`, AlterarBanner)
            configbot(interaction, user, client)
        } else {
            interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um BANNER invalido para seu BOT;` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
        }
    }


    if (interaction.customId === 'ChangeStatusBOT') {
        const typestatus = interaction.fields.getTextInputValue('typestatus');
        const ativistatus = interaction.fields.getTextInputValue('ativistatus');
        const textstatus = interaction.fields.getTextInputValue('textstatus');
        const urlstatus = interaction.fields.getTextInputValue('urlstatus');

        if (typestatus !== 'Online' && typestatus !== 'Ausente' && typestatus !== 'Invisível' && typestatus !== 'Não Perturbar') return interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu um TIPO incorreto de STATUS;` })
        if (ativistatus !== "Jogando" && ativistatus !== "Assistindo" && ativistatus !== "Competindo" && ativistatus !== "Transmitindo" && ativistatus !== "Ouvindo") return interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu uma ATIVIDADE incorreto de STATUS;` })
        if (ativistatus == "Transmitindo") {
            if (urlstatus == "") {
                interaction.reply({ ephemeral: true, content: `❌ | Você não colocou um link.` })
                return
            }
        }


        client.db.General.set(`ConfigGeral.StatusBot.typestatus`, typestatus)
        client.db.General.set(`ConfigGeral.StatusBot.ativistatus`, ativistatus)
        client.db.General.set(`ConfigGeral.StatusBot.textstatus`, textstatus)

        interaction.reply({ content: `CERTO: Você alterou com sucesso o STATUS de seu BOT`, ephemeral: true })

        if (urlstatus !== "") {
            client.db.General.set(`ConfigGeral.StatusBot.urlstatus`, urlstatus)
        }


    }
}




function ButtonDuvidasPainel(interaction, client) {

    let status = client.db.General.get(`ConfigGeral.statusduvidas`) ? "ON" : "OFF"
    let buttonColor
    let label
    let emoji

    if (status == 'ON') {
        status = `\`🟢 Ativado\``
        buttonColor = 4
        label = 'Desligar Sistema'
        emoji = "<:desligar:1238978047504547871>"
    } else {
        status = `\`🔴 Desativado\``
        buttonColor = 3
        label = 'Ativar Sistema'
        emoji = "<:Ligado:1238977621220655125>"
    }

    let canal = client.db.General.get(`ConfigGeral.channelredirectduvidas`) == null ? '\`Não definido...\`' : `<#${client.db.General.get(`ConfigGeral.channelredirectduvidas`)}>`
    let textoduvidas = client.db.General.get(`ConfigGeral.textoduvidas`) == null ? 'Dúvida' : client.db.General.get(`ConfigGeral.textoduvidas`)
    let emojiduvidas = client.db.General.get(`ConfigGeral.emojiduvidas`) == null ? '🔗' : client.db.General.get(`ConfigGeral.emojiduvidas`)

    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Botão de Dúvidas`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Configurações do Sistema de dúvidas:`)
        .setFields(
            { name: `Sistema Dúvidas:`, value: `${status}`, inline: false },
            { name: `Canal de Redirecionamento:`, value: `${canal}`, inline: false },
            { name: `Texto Button:`, value: `\`${textoduvidas}\``, inline: false },
            { name: `Emoji Button:`, value: `\`${emojiduvidas}\``, inline: false }
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("StatusDuvidas")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(buttonColor),
            new ButtonBuilder()
                .setCustomId("changechannelredirecionamento")
                .setLabel('Alterar Canal de Redirecionamento')
                .setEmoji(`1237122940617883750`)
                .setStyle(2),
        )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("changetextoduvidas")
            .setLabel('Alterar Texto Button')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("changeemojiduvidas")
            .setLabel('Alterar Emoji Button')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ embeds: [embed], components: [row, row2], content: `` })

}


async function configchannels(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return


    let logsistema = client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`)}>`
    let logsadm = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`)}>`
    let logspub = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`)}>`
    let logavaliar = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`)}>`
    let logsugestao = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`)}>`
    let logcategoria = client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) == null ? '\`Não Definido...\`' : `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)}>`
    let logcargo = client.db.General.get(`ConfigGeral.ChannelsConfig.CargoCliente`) == null ? '\`Não Definido...\`' : `<@&${client.db.General.get(`ConfigGeral.ChannelsConfig.CargoCliente`)}>`
    let statuscarrinho = client.db.General.get(`ConfigGeral.statuslogcompras`) == null ? '\`🟢 Ativado\`' : client.db.General.get(`ConfigGeral.statuslogcompras`) == true ? '\`🟢 Ativado\`' : `\`🔴 Desativado\``

    let buttonColor
    let label
    let emoji
    if (statuscarrinho == '\`🟢 Ativado\`') {
        buttonColor = 4
        label = 'Desativar Logs Carrinhos'
        emoji = "<:desligar:1238978047504547871>"
    } else {
        buttonColor = 3
        label = 'Ativar Logs Carrinhos'
        emoji = "<:Ligado:1238977621220655125>"
    }


    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: `${client.user.username} | Painel de Canais`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Configurações dos Canais:`)
        .setFields(
            { name: `Logs ADM:`, value: `${logsadm}`, inline: false },
            { name: `Logs Publica:`, value: `${logspub}`, inline: false },
            { name: `Logs Avaliar:`, value: `${logavaliar}`, inline: false },
            { name: `Logs Sugestão:`, value: `${logsugestao}`, inline: false },
            { name: `Logs Sistema:`, value: `${logsistema}`, inline: false },
            { name: `Categoria Vendas:`, value: `${logcategoria}`, inline: false },
            { name: `Cargo Cliente:`, value: `${logcargo}`, inline: false },
            { name: `Logs Carrinhos:`, value: `${statuscarrinho}`, inline: false },
        )


    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("desativarlogcarrinhos")
            .setLabel(label)
            .setEmoji(emoji)
            .setStyle(buttonColor),
        new ButtonBuilder()
            .setCustomId("ChangeChannelLogsPublica")
            .setLabel('Definir Canal de Logs (Publica)')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ChangeChannelCategoriaShop")
            .setLabel('Definir Categoria de Vendas')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
    )

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ChangeCargoCliente")
            .setLabel('Definir Cargo Cliente')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ChangeChannelLogs")
            .setLabel('Definir Canal de Logs (ADM)')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ChangeChannelsugestao")
            .setLabel('Definir Canal de Sugestão')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
    )
    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ChangeChannelavaliar")
            .setLabel('Definir Canal de Avaliação')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ChangeChannelentrada")
            .setLabel('Definir Canal de Entrada')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("ChangeChannelsaida")
            .setLabel('Definir Canal de Saída')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
    )
    const row4 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("ChangeChannelMod")
            .setLabel('Definir Canal do Sistema')
            .setEmoji(`1237122940617883750`)
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId("returndefinicoesconfig")
            .setEmoji(`1237055536885792889`)
            .setStyle(2),
    )

    interaction.message.edit({ content: ``, embeds: [embed], components: [row, row2, row3, row4] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}


async function configchannelsToggle(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    if (interaction.customId == 'ChangeChannelTicket') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelTicket`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelTicket`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canalticketdirect')
                    .setPlaceholder('Selecione abaixo qual é seu canal de TICKET.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }



    if (interaction.customId == 'ChangeChannelLogs') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallog')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de log ADM.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }

    if (interaction.customId == 'ChangeChannelLogsPublica') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallogpublica')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de log Publica.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }

    if (interaction.customId == 'ChangeChannelsugestao') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallogsugestao')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Sugestão.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }

    if (interaction.customId == 'ChangeChannelavaliar') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallogavaliar')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Avaliação.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }




    if (interaction.customId == 'ChangeChannelentrada') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelentrada')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Entrada.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }


    if (interaction.customId == 'ChangeChannelsaida') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelsaida')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Saida.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ content: ``, components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }
    if (interaction.customId == 'ChangeChannelMod') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelMod')
                    .setPlaceholder('Selecione abaixo qual será o CANAL do Sistema.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ content: ``, components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }






    if (interaction.customId == 'ChangeChannelCategoriaShop') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Categoria Definida: ⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) != null ? `<#${client.db.General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelCategoriaShop')
                    .setPlaceholder('Selecione abaixo qual será a CATEGORIA de seus CARRINHOS.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildCategory)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ content: ``, components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }
    if (interaction.customId == 'ChangeCargoCliente') {
        const embed = new EmbedBuilder()
            .setColor(`#2b2d31`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Categoria Definida: ⁠${client.db.General.get(`ConfigGeral.ChannelsConfig.CargoCliente`) != null ? `<@&${client.db.General.get(`ConfigGeral.ChannelsConfig.CargoCliente`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('ChangeCargoCliente')
                    .setPlaceholder('Selecione abaixo qual cargo será setado aos CLIENTES.')
                    .setMaxValues(1)

            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setEmoji(`1237055536885792889`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.message.edit({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }
}

async function CompletConfigChannels(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId == 'canallog') {

        client.db.General.set(`ConfigGeral.ChannelsConfig.ChannelLogAdm`, interaction.values[0])
        configchannels(interaction, user, client)
    }
    if (interaction.customId == 'canallogpublica') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChannelLogPublica`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'ChangeChannelentrada') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`, interaction.values[0])
        configchannels(interaction, user, client)
    }
    if (interaction.customId == 'ChangeChannelsaida') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`, interaction.values[0])
        configchannels(interaction, user, client)
    }
    if (interaction.customId == 'ChangeChannelMod') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChangeChannelMod`, interaction.values[0])
        configchannels(interaction, user, client)
    }
    if (interaction.customId == 'canalticketdirect') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChannelTicket`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'canallogsugestao') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChannelSugestao`, interaction.values[0])
        configchannels(interaction, user, client)
    }


    if (interaction.customId == 'canallogavaliar') {
        client.db.General.set(`ConfigGeral.ChannelsConfig.ChannelAvaliar`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'ChangeChannelCategoriaShop') {

        client.db.General.set(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'ChangeCargoCliente') {

        client.db.General.set(`ConfigGeral.ChannelsConfig.CargoCliente`, interaction.values[0])
        configchannels(interaction, user, client)
    }
}


async function ConfigTermo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return interaction.deferUpdate()

    const modalaAA = new ModalBuilder()
        .setCustomId('newtermocompra')
        .setTitle(`🔧 | Alterar Termos De Compra`);

    const newnameboteN = new TextInputBuilder()
        .setCustomId('newtermocompra')
        .setLabel("TERMOS DE COMPRA:")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)

    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
    modalaAA.addComponents(firstActionRow3);
    await interaction.showModal(modalaAA);
}
async function ConfigTermoConfig(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'newtermocompra') {
        const newtermocompra = interaction.fields.getTextInputValue('newtermocompra');
        interaction.reply({
            ephemeral: true,
            content: `CERTO: Você alterou o TERMO de comprade sua LOJA.
        
**${newtermocompra}**`
        })

        client.db.General.set(`ConfigGeral.TermosCompra`, newtermocompra)
        updateMessageConfig(interaction, user, client)
    }
}

function ConfigCashBack(interaction, user, client) {


    let status = client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`) == null ? 'OFF' : client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`)
    let label
    let emoji
    let style
    if (status == 'ON') {
        status = `\`🟢 Ativado\``
        label = `Desativar Cash-Back`
        emoji = `1238978047504547871`
        style = 4
    } else {
        status = `\`🔴 Desativado\``
        label = `Ativar Cash-Back`
        emoji = `1238977621220655125`
        style = 3
    }

    let Porcentagem = client.db.General.get(`ConfigGeral.CashBack.Porcentagem`) == null ? '0' : client.db.General.get(`ConfigGeral.CashBack.Porcentagem`)



    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: `${client.user.username} | Painel Cash-Back`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`- Configurações de Cash-Back.`)
        .setFields(
            { name: `Status Cash-Back:`, value: `${status}` },
            { name: `Porcentagem Cash-Back:`, value: `\`${Porcentagem}%\`` }
        )


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("cashtoggle")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(style),
            new ButtonBuilder()
                .setCustomId("configurarporcentagemcashback")
                .setLabel('Configurar Porcentagem')
                .setEmoji(`1233103068942569543`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function UpdateCashBack(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const currentStatus = client.db.General.get(`ConfigGeral.CashBack.ToggleCashBack`);
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    client.db.General.set(`ConfigGeral.CashBack.ToggleCashBack`, newStatus);

    ConfigCashBack(interaction, user, client)
}
function autorole(interaction, client) {

    const gawawg2 = client.db.General.get(`ConfigGeral.AutoRole.add`)

    var cargosadd = ''
    if (gawawg2 !== null) {
        for (const add of gawawg2) {
            cargosadd += `<@&${add}>\n`
        }
    } else {
        cargosadd = `Nenhum Cargo Definido!`
    }



    const embed = new EmbedBuilder()
        .setColor(`#2b2d31`)
        .setAuthor({ name: ` ${client.user.username} | Painel AutoRole`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .addFields(
            { name: `Cargos Automáticos:`, value: `${cargosadd}` }
        )

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("AdicionarNaAutorole")
                .setLabel('Adicionar Cargo Ao Entrar')
                .setEmoji(`1233110125330563104`)
                .setStyle(3),
            new ButtonBuilder()
                .setCustomId("returnconfigmoderacao")
                .setEmoji(`1237055536885792889`)
                .setStyle(2)
        )

    interaction.message.edit({ embeds: [embed], components: [row] })
}


module.exports = {
    updateMessageConfig,
    UpdateStatusVendas,
    UpdatePagamento, ConfigMP,
    ToggeMP,
    TimeMP,
    ConfigSaldo,
    ToggleSaldo,
    bonusSaldo,
    ConfigSemiAuto,
    ConfigCashBack,
    ToggleSemiAuto,
    PixChangeSemiAuto,
    configbot,
    configbotToggle,
    FunctionCompletConfig,
    configchannels,
    configchannelsToggle,
    CompletConfigChannels,
    ConfigTermo,
    UpdateCashBack,
    ConfigTermoConfig,
    ButtonDuvidasPainel,
    SaldoInvitePainel,
    BlackListPainel,
    configmoderacao,
    autorole,
    definicoes,
    mensagemautogeral,
    removerprodutosrepostar,
    adicionarprodutosrepostar,
    configprodutosrespotar,
    acoesautomaticas,
    autolock,
    mensagemabertura,
    testarbertura,
    mensagemfechamento,
    testarfechamento,
    blockbank,
    unlockbank
};