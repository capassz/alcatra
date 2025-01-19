
const axios = require('axios');
const mercadopago = require("mercadopago");
const { verificarpagamento, EntregarProdutos } = require("../../FunctionsAll/ChackoutPagamentoNovo");

module.exports = {
    name: 'ready',
    run: async (client) => {

        setInterval(async () => {
            verificarpagamento(client)
        }, 10000)//EntregarProdutos(client)



        setInterval(async () => {
            var u = client.db.RoleTime.fetchAll()
            for (const obj of u) {
                const id = obj.ID;
                const dataArray = obj.data;
                for (const dataObj of dataArray) {
                    const timestamp = dataObj.timestamp;
                    const guildid = dataObj.guildid;
                    const role = dataObj.role;
                    const produto = dataObj.produto;

                    if (timestamp <= Date.now()) {
                        try {
                            const member = await client.guilds.cache.get(guildid).members.fetch(id);
                            member.roles.remove(role)
                            const channela = client.channels.fetch(client.db.General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                            client.db.RoleTime.pull(id, (element, index, array) => element.role)
                            member.send({ content: `Sua TAG do produto **${produto}** foi removida pois seu TEMPO DE CARGO esgotou.` })
                            channela.send({ content: `${member} | TAG do produto **${produto}** foi removida pois TEMPO DE CARGO esgotou.` })
                        } catch (error) {
                            if (error.message === "Unknown Member") {
                                console.error(`Erro ocorrido ao processar o membro com ID ${id} Membro não encontrado.`);
                            } else {
                                console.error("Erro ocorrido ao processar o membro:", id);
                            }
                        }
                    }
                }
            }
        }, 120000)


    }
}