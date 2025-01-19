const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB();
var uu = db.table('permissionsmessage2')

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

async function StartConfigProduto(interaction, produto, client, user) {
    var u = client.db.produtos.get(`${produto}.settings.price`)

    var s = await client.db.produtos.get(`${produto}.settings.estoque`)

    const gfgf = await client.db.produtos.get(`${produto}`)

    if (gfgf == null) return interaction.reply({ content: `❌ | Este produto não está configurado para este servidor!`, ephemeral: true })

    var ggg = client.db.produtos.get(`${produto}.settings.CargosBuy`)

    if (ggg == null) {
        ggg = `\`Todos Cargos!\``
    } else {
        let roleMentions = '';

        for (const roleId of ggg) {
            roleMentions += `\n- <@&${roleId}>`;
        }
        ggg = roleMentions;
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | **Descrição:**\n\n${client.db.produtos.get(`${produto}.settings.desc`)}\n\n${obterEmoji(7)} | Id: ${client.db.produtos.get(`${produto}.ID`)}\n🏷️ | Nome: ${client.db.produtos.get(`${produto}.settings.name`)}\n${obterEmoji(14)} | Preço: R$ ${Number(u).toFixed(2)}\n${obterEmoji(12)} | Estoque quantidade: ${s == null ? 0 : Object.keys(s).length}\n\n${obterEmoji(13)} | Cargos que podem comprar: ${ggg}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("alterarnomeproduto")
                .setLabel('NOME')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("alterarpriceproduto")
                .setLabel('PREÇO')
                .setEmoji(`1233103068942569543`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("alterardescproduto")
                .setLabel('DESCRIÇÃO')
                .setEmoji(`1237122937631408128`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("alterarestoqueproduto")
                .setLabel('ESTOQUE')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configavancadaproduto")
                .setLabel('Configurações Avançadas')
                .setEmoji(`1237120481887518850`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone")
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1238978383845654619`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("deletarproduto")
                .setLabel('Deletar')
                .setEmoji(`1229787813046915092`)
                .setStyle(4),
            new ButtonBuilder()
                .setCustomId("infoproduto")
                .setEmoji(`1243277106079600641`)
                .setStyle(1)
        )

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("CargosBuyer")
                .setLabel('Cargos autorizados comprar')
                .setEmoji(`1233127515141308416`)
                .setStyle(3)
        )



    if (interaction.message == undefined) {
        await interaction.reply({ embeds: [embed], components: [row, row2, row3] }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            uu.set(lastMessage.id, { user: user, produto: produto })
            createCollector(u);
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2, row3] }).then(u => {
            createCollector(u);
        })
    }
}

function alterarnomeproduto(interaction, produto, user, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`🏷️ | **Nome Atual:** ${client.db.produtos.get(`${produto}.settings.name`)}\n\nEnvie o novo nome abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)

    interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, user)
                return
            }

            if (message.content == '') {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu um valor INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            client.db.produtos.set(`${produto}.settings.name`, message.content)
            msg.reply({ content: `${obterEmoji(8)} | O nome foi atualizado com sucesso para \`${message.content}\`.` }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
            StartConfigProduto(interaction, produto, client, user)
        })
        collector.on('end', async (message) => {
            message.delete()
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

function alterarpriceproduto(interaction, produto, user, client) {
    var u = client.db.produtos.get(`${produto}.settings.price`)
    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(14)} | **Preço Atual:** ${Number(u).toFixed(2)}\n\nEnvie o novo preço abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)


    interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, user)
                return
            }

            if (message.content == '') {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu um valor INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            if (isNaN(message.content)) {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu um valor INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            client.db.produtos.set(`${produto}.settings.price`, Number(message.content))
            msg.reply({ content: `${obterEmoji(8)} | O preço foi atualizado com sucesso para \`${Number(message.content).toFixed(2)}\`.`, ephemeral: true }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
            StartConfigProduto(interaction, produto, client, user)
        })
        collector.on('end', async (message) => {
            message.delete()
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

function alterardescproduto(interaction, produto, user, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | **Descrição atual:** \`\`\`${client.db.produtos.get(`${produto}.settings.desc`)}\`\`\`\nEnvie a nova descrição abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**
`)

    interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, user)
                return
            }

            if (message.content == '') {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu uma descrição INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            client.db.produtos.set(`${produto}.settings.desc`, message.content)
            msg.reply({ content: `${obterEmoji(8)} | A descrição foi atualizado com sucesso.`, ephemeral: true }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
            StartConfigProduto(interaction, produto, client, user)
        })
        collector.on('end', async (message) => {
            message.delete()
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




async function alterarestoqueproduto(interaction, produto, user, client) {
    const u = client.db.produtos.get(`${produto}.settings.estoque`)
    var result = '';
    for (const key in u) {
        result += `${obterEmoji(12)}**| ` + key + '** - ' + u[key] + '\n';
    }
    if (result == '') result = 'Sem estoque, adicione'

    var fot = 'Esse é seu estoque completo!'
    if (result.length >= 2048) {
        result = result.substring(0, 2000); // Obter os primeiros 2000 caracteres
        fot = "Existem + produtos no estoque, faça um backup para ver seu estoque completo!";
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | Este é seu estoque:\n\n${result}`)
        .setFooter({ text: `${fot}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addstock")
                .setLabel('ADICIONAR')
                .setEmoji(`1233110125330563104`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("remstock")
                .setLabel('REMOVER')
                .setEmoji(`1242907028079247410`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("backupstock")
                .setLabel('BACKUP')
                .setEmoji(`1229787811205353493`)
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId("clearstock")
                .setLabel('LIMPAR')
                .setEmoji(`1229787813046915092`)
                .setStyle(4)
        )
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone")
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1238978383845654619`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("vltconfigstart")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )


    interaction.message.edit({ content: ``, embeds: [embed], components: [row, row2] }).then(u => {
        createCollector(u);
    })

}

function configavancadaproduto(interaction, produto, user, client) {

    let statuscupom = client.db.produtos.get(`${produto}.embedconfig.cupom`) == true ? 'Pode utilizar cupom nesse produto!' : `Não pode utilizar nenhum cupom nesse produto!`
    let label
    let emoji
    let ButtonStyle

    if (statuscupom == 'Pode utilizar cupom nesse produto!') {
        label = 'Desativar Cupons'
        emoji = '1238978047504547871'
        ButtonStyle = 4
    } else {
        label = 'Ativar Cupons'
        emoji = '1238977621220655125'
        ButtonStyle = 3
    }

    let bannerproduto = client.db.produtos.get(`${produto}.embedconfig.banner`) == null ? 'Não definido' : `[Banner](${client.db.produtos.get(`${produto}.embedconfig.banner`)})`
    let miniaturaproduto = client.db.produtos.get(`${produto}.embedconfig.miniatura`) == null ? 'Não definido' : `[Miniatura](${client.db.produtos.get(`${produto}.embedconfig.miniatura`)})`
    let cargoproduto = client.db.produtos.get(`${produto}.embedconfig.cargo.name`) == null ? 'Não definido' : `<@&${client.db.produtos.get(`${produto}.embedconfig.cargo.name`)}`
    let colorproduto = client.db.produtos.get(`${produto}.embedconfig.color`) == null ? '#2b2d31' : `${client.db.produtos.get(`${produto}.embedconfig.color`)}`
    let categoriaproduto = client.db.produtos.get(`${produto}.embedconfig.categoria`) == null ? 'Não definido' : `<#${client.db.produtos.get(`${produto}.embedconfig.categoria`)}`
    let cupomproduto = client.db.produtos.get(`${produto}.embedconfig.cupom`) == true ? 'Pode utilizar cupom nesse produto!' : `Não pode utilizar nenhum cupom nesse produto!`

    const embed = new Discord.EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username} | Configurações Avançadas` })
        // .setDescription(`🛒 | Categoria: ${client.db.produtos.get(`${produto}.embedconfig.categoria`) == null ? 'Não definido' : `<#${client.db.produtos.get(`${produto}.embedconfig.categoria`)}>`}\n📂 | Banner: \n🖼️ | Miniatura: ${client.db.produtos.get(`${produto}.embedconfig.miniatura`) == null ? 'Não definido' : `[Miniatura](${client.db.produtos.get(`${produto}.embedconfig.miniatura`)})`}\n${obterEmoji(13)} | Cargo: \n1233129471922540544️ | Cor Embed: ${client.db.produtos.get(`${produto}.embedconfig.color`) == null ? '#2b2d31' : `${client.db.produtos.get(`${produto}.embedconfig.color`)}`}\n🕳 | Cupom: ${statuscupom}`)
        .setDescription(`- Configurações do Produto: \`${produto}\``)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setFields(
            { name: 'Categoria', value: `${categoriaproduto}`, inline: true },
            { name: 'Banner', value: `${bannerproduto}`, inline: true },
            { name: 'Miniatura', value: `${miniaturaproduto}`, inline: true },
            { name: 'Cargo', value: `${cargoproduto}`, inline: true },
            { name: 'Cor Embed', value: `${colorproduto}`, inline: true },
            { name: 'Cupom', value: `${cupomproduto}`, inline: true }
        )



    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("BannerChangeProduto")
                .setLabel('Banner')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("MiniaturaChangeProduto")
                .setLabel('Miniatura')
                .setEmoji(`🖼️`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("CargoChangeProduto")
                .setLabel('Cargo')
                .setEmoji(`1233127515141308416`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("CorEmbedProduto")
                .setLabel('Cor Embed')
                .setEmoji(`1233129471922540544`)
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId("CategoriaProdutoChangeeee")
                .setLabel('Definir Categoria')
                .setEmoji(`1233127513178247269`)
                .setStyle(2)
        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("togglecuponsprodutoo")
                .setLabel(label)
                .setEmoji(emoji)
                .setStyle(ButtonStyle),
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone")
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1238978383845654619`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("vltconfigstart")
                .setEmoji(`1237055536885792889`)
                .setStyle(2),
        )

    interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {
        createCollector(u);
    })
}



async function CargoChangeProduto(interaction, client) {
    const t = await uu.get(interaction.message.id)

    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Outras Configurações`)
        .setDescription(`${obterEmoji(13)} | Cargo:  ${client.db.produtos.get(`${t.produto}.embedconfig.cargo.name`) == null ? 'Não configurado...' : `<@&${client.db.produtos.get(`${t.produto}.embedconfig.cargo.name`)}>`}\n🕒 | Cargo Temporário: ${client.db.produtos.get(`${t.produto}.embedconfig.cargo.tempo`) == null ? 'Não configurado...' : `${client.db.produtos.get(`${t.produto}.embedconfig.cargo.tempo`)}`}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("setroleproduto")
                .setLabel('Setar Cargo')
                .setEmoji(`1233127515141308416`)
                .setStyle(1)
                .setDisabled(false)
        )
    if (client.db.produtos.get(`${t.produto}.embedconfig.cargo.name`) == null) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("settemproleproduto")
                .setLabel('Cargo Temporário On/Off')
                .setEmoji('1233127515141308416')
                .setStyle(1)
                .setDisabled(true)
        );
    } else {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("settemproleproduto")
                .setLabel('Cargo Temporário On/Off')
                .setEmoji('1233127515141308416')
                .setStyle(1)
                .setDisabled(false)
        );
    }
    row.addComponents(
        new ButtonBuilder()
            .setCustomId("vlarteconfigavancadaproduto")
            .setEmoji(`1237055536885792889`)
            .setStyle(1)
            .setDisabled(false),
    );

    interaction.message.edit({ embeds: [embed], components: [row] }).then(u => {
        createCollector(u);
    })
}

async function atualizarmessageprodutosone(interaction, client) {
    const t = await uu.get(interaction.message.id)
    if (t.user !== interaction.user.id) return interaction.deferUpdate()
    var s = client.db.produtos.get(`${t.produto}.settings.estoque`)
    var dd = client.db.produtos.get(`${t.produto}`)

    const embeddesc = client.db.DefaultMessages.get(`ConfigGeral`)


    var modifiedEmbeddesc = embeddesc.embeddesc
        .replace('#{desc}', client.db.produtos.get(`${t.produto}.settings.desc`))
        .replace('#{nome}', client.db.produtos.get(`${t.produto}.settings.name`))
        .replace('#{preco}', Number(client.db.produtos.get(`${t.produto}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length);

    var modifiedEmbeddesc2 = embeddesc.embedtitle
        .replace('#{nome}', client.db.produtos.get(`${t.produto}.settings.name`))
        .replace('#{preco}', Number(client.db.produtos.get(`${t.produto}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length)

    const dddddd = client.db.General.get(`ConfigGeral.ColorEmbed`) == '#2b2d31' ? `#000000` : client.db.General.get(`ConfigGeral.ColorEmbed`)

    const embed = new Discord.EmbedBuilder()
        .setTitle(modifiedEmbeddesc2)
        .setDescription(modifiedEmbeddesc)
        .setColor(`${dd.embedconfig.color == null ? dddddd : dd.embedconfig.color}`)

    if (dd.embedconfig.banner !== undefined) {

        embed.setImage(dd.embedconfig.banner)
    } else {

        if (client.db.General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
            embed.setImage(client.db.General.get(`ConfigGeral.BannerEmbeds`))
        }
    }


    if (dd.embedconfig.miniatura !== undefined) {
        embed.setThumbnail(dd.embedconfig.miniatura)
    } else {
        if (client.db.General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
            embed.setThumbnail(client.db.General.get(`ConfigGeral.MiniaturaEmbeds`))
        }
    }

    if (client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) !== null) {
        embed.setFooter({ text: client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) })
    }


    if (client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) !== null) {
        embed.setFooter({ text: client.db.DefaultMessages.get(`ConfigGeral.embedrodape`) })
    }



    try {
        const channel = await client.channels.fetch(dd.ChannelID);
        const fetchedMessage = await channel.messages.fetch(dd.MessageID);




        if (interaction.guild.id == '1241239036786511954') {
            
        } else {
            await fetchedMessage.edit({ embeds: [embed] });
        }




        await interaction.reply({ content: `${obterEmoji(8)} | Mensagem do produto: \`${t.produto}\``, ephemeral: true })
    } catch (error) {

    }
}

module.exports = {
    StartConfigProduto,
    alterarnomeproduto,
    alterarpriceproduto,
    alterardescproduto,
    alterarestoqueproduto,
    configavancadaproduto,
    CargoChangeProduto,
    atualizarmessageprodutosone
};