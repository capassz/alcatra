const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const axios = require('axios');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
    name: 'ready',

    run: async (client) => {




        function enviarMensagem(mensagem, canalId, client) {


            const row222 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('asSs')
                        .setLabel('Mensagem do Automatica')
                        .setStyle(2)
                        .setDisabled(true)
                );


            if (mensagem.titulo === '' && mensagem.bannerembed === '') {
                try {
                    const channela = client.channels.cache.get(canalId);
                    channela.send({ content: `${mensagem.descricao}`, components: [row222] })
                } catch (error) {


                }
            } else {

                const embed = new EmbedBuilder()

                embed.setColor(client.db.General.get(`ConfigGeral.ColorEmbed`) === '#635b44' ? 'Random' : `${client.db.General.get(`ConfigGeral.ColorEmbed`)}`);

                if (mensagem.titulo !== '') {
                    embed.setTitle(mensagem.titulo);
                }

                if (mensagem.descricao !== '') {
                    embed.setDescription(mensagem.descricao);
                }

                if (mensagem.bannerembed !== '') {
                    embed.setImage(mensagem.bannerembed);
                }

                try {
                    const channela = client.channels.cache.get(canalId);
                    channela.send({ embeds: [embed], components: [row222] })

                } catch (error) {


                }
            }


        }

        function agendarMensagens(autoMessages, client) {
            const ggg = client.db.General.get(`ConfigGeral.AutoMessage`)
            if (ggg !== null) {
                ggg.forEach(([mensagem]) => {
                    const { titulo, descricao, bannerembed, time, idchanell } = mensagem;
                    const intervalo = parseInt(time, 10) * 1000;

                    enviarMensagem(mensagem, idchanell, client);

                    setInterval(() => {
                        enviarMensagem(mensagem, idchanell, client);
                    }, intervalo);
                });
            }
        }

        setTimeout(() => {
            agendarMensagens(null, client);
        }, 2000);
        

        let lastData = null;
        const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
        const banImage = "https://c.tenor.com/ivrqrn5qtvwAAAAC/tenor.gif";

        setInterval(async () => {
            return
            const config = {
                method: "GET",
                headers: {
                    'Authorization': 'SUASENHA'
                }
            };
            const data = await fetch("http://apivendas.squareweb.app/api/v1/guilds/blacklist", config);
            const info = await data.json();
            const users = info?.users;

            // Nenhum dado novo. Não precisa fazer nada. Skipa verificação, economizando recursos.
            if (JSON.stringify(lastData) == JSON.stringify(users)) return;
            lastData = users;

            users.forEach(element => client.guilds.cache.forEach(async (guild) => {
                const userToBan = await client.users.fetch(element).catch(() => null);

                if (userToBan) {
                    await delay(1500);
                    const userHasBeenBanned = await guild.bans.fetch(userToBan.id).catch(() => null);
                    if (!userHasBeenBanned) {
                        await delay(1500); // 1.5s;
                        await userToBan.send({ files: [banImage], content: `👋 | Sinta-se privilegiado, Você está **BLOQUEADO** de estar em servidores que utilizam o **BOT** da **Rare Apps**!` }).catch(() => null);

                        guild.members.ban(userToBan, { reason: "BlackList Global (Rare Apps)" }).then(() => {
                            const webhookClient = new WebhookClient({ url: "https://discord.com/api/webhooks/1167832146384277554/mgfKrT_BezzNy5bVKW-bfOwKYc8ftglbvMYBHwRY94yr_Yh6XDmqYNlCf0w9NbmFINEz" });
                            webhookClient.send({ content: `✅ | Usuário ${userToBan.globalName} (\`${userToBan.id}\`) foi banido em ${guild.name} (BlackList Global) - Rare Apps` })
                        }).catch(() => null);
                    }
                }
            }));

        }, 5 * 60 * 1000);
    }
}


