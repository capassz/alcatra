const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var uu = db.table('permissionsmessage10384')

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

function CriadosStart(interaction, client) {
    const embed = new EmbedBuilder()
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Sistema de Vendas`)
        .setDescription(`Clique no que você deseja ver:`)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("criadosproduto")
                .setLabel('Produtos')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadoscupons")
                .setLabel('Cupons')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadoskeys")
                .setLabel('Keys')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadosgifts")
                .setLabel('GiftCards')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("criadossemstock")
                .setLabel('Produtos sem Estoque')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("criadosdrop")
                .setLabel('Drops')
                .setEmoji(`1242666444051976298`)
                .setStyle(2)
                .setDisabled(false),
        )
    if (interaction.message == undefined) {
        interaction.reply({ embeds: [embed], components: [row, row2], fetchReply: true }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            uu.set(lastMessage.id, interaction.user.id)
            createCollector(u);
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2], fetchReply: true }).then(u => {
            createCollector(u);
        })
    }

}

function paginascreate(interaction, title, blocks, client) {
    const pages = splitIntoPages(blocks);
    let pageNumber = 1;

    const embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(pages[pageNumber - 1])
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setFooter({ text: `Página ${pageNumber}/${pages.length}` });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("primeirapagina")
                .setEmoji(`⏮`)
                .setStyle(2)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("paginaanterior")
                .setEmoji(`⬅`)
                .setStyle(2)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("selecionarpagina")
                .setLabel('Go To Page')
                .setEmoji(`📄`)
                .setStyle(3)
                .setDisabled(pages.length === 1),
            new ButtonBuilder()
                .setCustomId("paginaseguinte")
                .setEmoji(`➡`)
                .setStyle(2)
                .setDisabled(pages.length === 1),
            new ButtonBuilder()
                .setCustomId("ultimapagina")
                .setEmoji(`⏭`)
                .setStyle(2)
                .setDisabled(pages.length === 1)
        );

    interaction.reply({ embeds: [embed], components: [row], fetchReply: true }).then(msg => {
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button });
        collector.on('collect', i => {
            let newPageNumber = pageNumber;

            switch (i.customId) {
                case 'primeirapagina':

                    newPageNumber = 1;
                    break;
                case 'ultimapagina':

                    newPageNumber = pages.length;
                    break;
                case 'paginaseguinte':

                    newPageNumber = Math.min(pageNumber + 1, pages.length);
                    break;
                case 'paginaanterior':

                    newPageNumber = Math.max(pageNumber - 1, 1);
                    break;
                case 'selecionarpagina':
                    i.deferUpdate();
                    askPageSelection(interaction, pages, title, client);
                    return;
                default:
                    break;
            }

            if (newPageNumber !== pageNumber) {
                pageNumber = newPageNumber;
                i.deferUpdate();
                updateMessageWithPages(pages, pageNumber, interaction, title, client);
            }
        });

    });
}

function askPageSelection(interaction, pages, title, client) {
    const promptEmbed = new EmbedBuilder()
        .setTitle(`Selecione uma página de ${title}`)
        .setDescription('Digite o número da página que deseja visualizar:')
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`);

    interaction.channel.send({ embeds: [promptEmbed] }).then(message => {
        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });

        collector.on('collect', m => {
            const inputPageNumber = parseInt(m.content);
            if (isNaN(inputPageNumber) || inputPageNumber < 1 || inputPageNumber > pages.length) {
                interaction.reply('Página inválida. Por favor, insira um número de página válido.').then(msg => {
                    setTimeout(() => {
                        msg.delete().catch(error => {

                        });
                    }, 3000);
                });
            } else {
                pageNumber = inputPageNumber;
                updateMessageWithPages(pages, pageNumber, interaction, title, client);
            }
            m.delete().catch(error => {

            });
            message.delete().catch(error => {

            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.delete().catch(error => {
                });
            }
        });
    });
}

function updateMessageWithPages(pages, pageNumber, interaction, title, client) {
    const embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(pages[pageNumber - 1])
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
        .setFooter({ text: `Página ${pageNumber}/${pages.length}` });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("primeirapagina")
                .setEmoji(`⏮`)
                .setStyle(2)
                .setDisabled(pageNumber === 1),
            new ButtonBuilder()
                .setCustomId("paginaanterior")
                .setEmoji(`⬅`)
                .setStyle(2)
                .setDisabled(pageNumber === 1),
            new ButtonBuilder()
                .setCustomId("selecionarpagina")
                .setLabel('Go To Page')
                .setEmoji(`📄`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("paginaseguinte")
                .setEmoji(`➡`)
                .setStyle(2)
                .setDisabled(pageNumber === pages.length),
            new ButtonBuilder()
                .setCustomId("ultimapagina")
                .setEmoji(`⏭`)
                .setStyle(2)
                .setDisabled(pageNumber === pages.length)
        );

    interaction.editReply({ embeds: [embed], components: [row], fetchReply: true }).catch(error => {
    });
}

function splitIntoPages(blocks) {
    const pages = [];
    let currentPage = '';

    for (let i = 0; i < blocks.length; i++) {
        currentPage += blocks[i] + '\n\n';

        if ((i + 1) % 10 === 0) {
            pages.push(currentPage);
            currentPage = '';
        }
    }

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return pages;
}

function produtoscriados(interaction, client) {

    var u = client.db.produtos.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii];
        const idproduto = u[iiiiii].data.ID
        const nameproduto = u[iiiiii].data.settings.name
        const priceproduto = u[iiiiii].data.settings.price

        const estoqueproduto = Object.keys(u[iiiiii].data.settings.estoque).length

        blocks.push(`${obterEmoji(12)} **| ID:** ${idproduto}\n🏷️ **| Nome:** ${nameproduto}\n${obterEmoji(14)} **| Preço:** ${Number(priceproduto).toFixed(2)}\n${obterEmoji(12)} **| QUANTIDADE:** ${estoqueproduto}`)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Produtos:'
    paginascreate(interaction, title, blocks, client);
}

function criadoscupons(interaction, client) {

    var u = client.db.Cupom.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const valorminimo = u[iiiiii].data.valorminimo

        const porcentagem = u[iiiiii].data.porcentagem
        const quantidade = u[iiiiii].data.quantidade

        blocks.push(`${obterEmoji(12)} **| Nome:** ${element}\n🏷️ **| Valor do Desconto:** ${porcentagem}%\n${obterEmoji(14)} **| Valor de Pedido Mínimo:** ${Number(valorminimo).toFixed(2)}\n${obterEmoji(12)} **| QUANTIDADE:** ${quantidade}`)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Cupons:'
    paginascreate(interaction, title, blocks, client);
}

function criadoskeys(interaction, client) {
    var u = client.db.Cupom.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        let cargo = u[iiiiii].data.cargo
        cargo = cargo ? `<@&${cargo}>` : 'Nenhum cargo definido'
        let cargo2 = u[iiiiii].data.cargo || 'Nenhum cargo definido'
        
        blocks.push(`${obterEmoji(12)} **| Key:** ${element}\n${obterEmoji(7)} **| ID do cargo:** ${cargo2}\n${obterEmoji(13)} **| Cargo:** ${cargo}`)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Keys:'
    paginascreate(interaction, title, blocks, client);
}

function criadosgifts(interaction, client) {
    var u = client.db.giftcards.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const cargo = u[iiiiii].data.valor

        blocks.push(`${obterEmoji(12)} **| GiftCard:** ${element}\n${obterEmoji(14)} **| Valor do Gift:** ${Number(cargo).toFixed(2)}`)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'GiftCards:'
    paginascreate(interaction, title, blocks, client);
}

function criadosdrop(interaction, client) {
    var u = client.db.drops.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const premio = u[iiiiii].data.premio

        blocks.push(`${obterEmoji(11)} | Código: ${element}\n${obterEmoji(6)} | OQUE SERÁ ENTREGUE:\n${premio}`)
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Drops:'
    paginascreate(interaction, title, blocks, client);
}










function rankprosdutos(interaction, client) {
    var u = client.db.estatisticas.fetchAll()

    function compararPorTotalQtd(a, b) {
        return b.data.TotalQtd - a.data.TotalQtd;
    }

    // Ordenar a lista em ordem decrescente de TotalQtd
    var bb = u.sort(compararPorTotalQtd);

    // Exibir a lista ordenada


    var position = -1;
    var blocks = []
    for (var i = 0; i < bb.length; i++) {

        if (i === 0) {
            emoji = '🥇';
        } else if (i === 1) {
            emoji = '🥈';
        } else if (i === 2) {
            emoji = '🥉';
        } else {
            emoji = '🏅';
        }

        var ia = client.db.produtos.get(bb[i].ID)
        if (ia !== null) {
            blocks.push(`${emoji} | **__${i + 1}°__** - ${ia.settings.name} - ${ia.ID}\n💳 | Rendeu: **R$${Number(bb[i].data.TotalPrice).toFixed(2)}**\n🛒 | Total de Vendas: **${Number(bb[i].data.TotalQtd)}**`);
        }
    }

    var title = 'Rank Produtos:'
    paginascreate(interaction, title, blocks, client);
}

function rank(interaction, client) {
    var u = client.db.usuariosinfo.fetchAll()
    var blocks = []
    u.sort((a, b) => b.data.gastos - a.data.gastos);
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID


        if (iiiiii === 0) {
            emoji = '🥇';
        } else if (iiiiii === 1) {
            emoji = '🥈';
        } else if (iiiiii === 2) {
            emoji = '🥉';
        } else {
            emoji = '🏅';
        }

        blocks.push(`${emoji} | **__${iiiiii + 1}°__** - <@${element}> - ${element}`);
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Rank:'
    paginascreate(interaction, title, blocks, client);
}

function rankadm(interaction, client) {
    var u = client.db.usuariosinfo.fetchAll()
    var blocks = []
    u.sort((a, b) => b.data.gastos - a.data.gastos);
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii].ID
        const price = u[iiiiii].data.gastos



        if (iiiiii === 0) {
            emoji = '🥇';
        } else if (iiiiii === 1) {
            emoji = '🥈';
        } else if (iiiiii === 2) {
            emoji = '🥉';
        } else {
            emoji = '🏅';
        }

        blocks.push(`${emoji} | **__${iiiiii + 1}°__** - <@${element}> - ${element}\n${obterEmoji(3)} | Gasto: **R$${Number(price).toFixed(2)}**`);
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Rank:'
    paginascreate(interaction, title, blocks, client);
}



function criadossemstock(interaction, client) {

    var u = client.db.produtos.fetchAll()
    var blocks = []
    for (let iiiiii = 0; iiiiii < u.length; iiiiii++) {
        const element = u[iiiiii];
        const idproduto = u[iiiiii].data.ID
        const nameproduto = u[iiiiii].data.settings.name
        const priceproduto = u[iiiiii].data.settings.price
        const pessoas = u[iiiiii].data.settings.notify

        var tt = 0

        if (pessoas !== null && pessoas !== 0 && pessoas !== undefined) {
            tt = pessoas.length
        } else {
            tt = 0
        }

        const estoqueproduto = Object.keys(u[iiiiii].data.settings.estoque).length

        if (estoqueproduto <= 0) {
            blocks.push(`${obterEmoji(12)} **| ID:** ${idproduto}\n🏷️ **| Nome:** ${nameproduto}\n${obterEmoji(14)} **| Preço:** ${Number(priceproduto).toFixed(2)}\n${obterEmoji(12)} **| QUANTIDADE:** ${estoqueproduto}\n${obterEmoji(13)} **| USUÁRIOS AGURDANDO ESTOQUE:** ${tt}`)
        }
    }
    const embed = new EmbedBuilder()
        .setTitle(`Erro - Sistema de Vendas`)
        .setDescription(`Não encontrei nada desse tipo cadastrado no bot!`)
        .setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`)
    if (blocks == 0) return interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true }).then(msg => {
        setTimeout(async () => {
            try {
                await msg.delete
            } catch (error) {

            }
        }, 3000);
    })

    var title = 'Produtos:'
    paginascreate(interaction, title, blocks, client);
}

module.exports = {
    CriadosStart,
    paginascreate,
    produtoscriados,
    criadoscupons,
    criadoskeys,
    criadossemstock,
    criadosgifts,
    criadosdrop,
    rank,
    rankadm,
    rankprosdutos
};