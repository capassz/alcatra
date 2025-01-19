const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, DiscordAPIError } = require('discord.js');

async function SelectProduct(client) {

    // quero enviar somente os id dos produtos salvos no General

    let produtosselecionados = client.db.General.get('ConfigGeral.produtosrespostar') || [];

    if (produtosselecionados.length === 0) return;

    const produtossalvos = client.db.produtos.fetchAll();

    if (!produtossalvos || produtossalvos.length === 0) return

    try {
        await Promise.all(produtosselecionados.map(async (produto) => {
            const produtoid = produtossalvos.find(p => p.ID === produto.id);
            if (!produtoid) return;

            const canalvendas = await client.channels.cache.get(produtoid.data.ChannelID);
            if (!canalvendas) return;

            let mensageminfo;
            try {
                mensageminfo = await canalvendas.messages.fetch(produtoid.data.MessageID);
            } catch (error) {
                return;
            }

            const botMessages = (await canalvendas.messages.fetch()).filter(msg => msg.author.id === client.user.id);
            await Promise.all(botMessages.map(async (msg) => {
                try {
                    await msg.delete();
                } catch (error) {
                }
            }));

            try {
                const sentMessage = await canalvendas.send({ embeds: [mensageminfo.embeds[0]], components: mensageminfo.components });
                await client.db.produtos.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                await client.db.produtos.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
            } catch (error) {
            }
        }));
        
    } catch (error) {
        console.log(`Erro ao enviar: ${error}`)
    }
}
async function SendAllMgs(client) {
    const produtossalvos = client.db.produtos.fetchAll();
    if (!produtossalvos || produtossalvos.length === 0) return

    try {
        await Promise.all(produtossalvos.map(async (produtoid) => {
            const canalvendas = await client.channels.cache.get(produtoid.data.ChannelID);
            if (!canalvendas) return;

            let mensageminfo;
            try {
                mensageminfo = await canalvendas.messages.fetch(produtoid.data.MessageID);
            } catch (error) {
                return;
            }

            const botMessages = (await canalvendas.messages.fetch()).filter(msg => msg.author.id === client.user.id);
            await Promise.all(botMessages.map(async (msg) => {
                try {
                    await msg.delete();
                } catch (error) {
                }
            }));

            try {
                const sentMessage = await canalvendas.send({ embeds: [mensageminfo.embeds[0]], components: mensageminfo.components });
                await client.db.produtos.set(`${produtoid.ID}.MessageID`, sentMessage.id);
                await client.db.produtos.set(`${produtoid.ID}.ChannelID`, sentMessage.channel.id);
            } catch (error) {
            }
        }));
    } catch (error) {
    }
}



module.exports = {
    SendAllMgs,
    SelectProduct
}