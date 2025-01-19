const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { obterEmoji } = require("../../Handler/EmojiFunctions");



module.exports = {
    name: 'guildMemberAdd',

    run: async (member, client) => {
        if (member.user.bot) return

        const gg = client.db.entradas.get(member.user.id)
        if (gg == null) {
            await client.db.entradas.set(member.user.id, { saidas: 0 })
        }

        const gg2 = client.db.entradas.get(member.user.id)


        const dataCriacaoConta = new Date(member.user.createdAt);
        const hoje = new Date();

        const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
        const diffEmMilissegundos = hoje - dataCriacaoConta;
        const diasDesdeCriacao = Math.floor(diffEmMilissegundos / umDiaEmMilissegundos);

        const embed = new EmbedBuilder()
            .setTitle(`${obterEmoji(31)} | Entrada`)
            .setDescription(`
        ${member.user} (${member.user.username})
        ${obterEmoji(17)} ${diasDesdeCriacao} dias no Discord.
        ${obterEmoji(18)} ${member.user.username} (${gg2.saidas} Saídas, 0 Fakes, ${gg2.saidas} Total).
        `)
            .setFooter({
                text: `${member.guild.name}`
            })
            .setTimestamp()
            .setColor('#10d4cc')

        try {
            const channela = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`));
            channela.send({ embeds: [embed] })
        } catch (error) {

        }




        try {
            const channelaasdawdw = client.db.General.get(`ConfigGeral.Entradas.channelid`)

            const gggg = client.db.General.get(`ConfigGeral.Entradas.msg`)

            const mapeamentoSubstituicao = {
                "{member}": `<@${member.user.id}>`,
                "{guildname}": `${member.guild.name}`
            };

            const substituirPalavras = (match) => mapeamentoSubstituicao[match] || match;
            const stringNova = gggg.replace(/{member}|{guildname}/g, substituirPalavras);


            const row222 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('asSs')
                        .setLabel('Mensagem do Sistema')
                        .setStyle(2)
                        .setDisabled(true)
                );

            channelaasdawdw.forEach(async element => {
                try {


                    const channela = client.channels.cache.get(element)
                    await channela.send({ components: [row222], content: `${stringNova}` }).then(msg => {
                        setTimeout(() => {
                            try {
                                msg.delete()
                            } catch (error) {

                            }
                        }, client.db.General.get(`ConfigGeral.Entradas.tempo`) * 1000);
                    })
                } catch (error) {

                }
            });


        } catch (error) {
        }


        const fffffffff2222222 = client.db.General.get(`ConfigGeral.AntiFake.nomes`)

        if (fffffffff2222222 !== null) {

            const contemNome = fffffffff2222222.some(nome => member.user.username.includes(nome))

            if (contemNome) {

                await member.kick()
                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${member.user.username}` })
                    .setTitle(`Anti-Fake`)
                    .setDescription(`Usuário foi expulso por ter o nome \`${member.user.username}\` que está na blacklist.`)
                    .addFields(
                        { name: `User ID`, value: `${member.user.id}`, inline: true },
                        { name: `Data de criação`, value: `<t:${Math.ceil(getCreationDateFromSnowflake(member.user.id) / 1000)}:R>`, inline: true }
                    )
                    .setFooter({
                        text: `${member.guild.name}`
                    })
                    .setTimestamp()
                    .setColor('Yellow')

                try {
                    const channela = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`));
                    channela.send({ embeds: [embed] })
                } catch (error) {

                }

            }


        }

        const fffffffff2222 = client.db.General.get(`ConfigGeral.AntiFake.status`)

        if (fffffffff2222 !== null) {

            try {
                await member.fetch(true)
                const presence = member.presence
                const customStatusActivity = presence.activities.find(activity => activity.type === 4);
                const customStatusState = customStatusActivity ? customStatusActivity.state : null;


                const contemNome = fffffffff2222.some(nome => customStatusState.includes(nome))
                if (contemNome) {

                    await member.kick()
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `${member.user.username}` })
                        .setTitle(`Anti-Fake`)
                        .setDescription(`Usuário foi expulso por ter o status \`${customStatusState}\` na blacklist.`)
                        .addFields(
                            { name: `User ID`, value: `${member.user.id}`, inline: true },
                            { name: `Data de criação`, value: `<t:${Math.ceil(getCreationDateFromSnowflake(member.user.id) / 1000)}:R>`, inline: true }
                        )
                        .setFooter({
                            text: `${member.guild.name}`
                        })
                        .setTimestamp()
                        .setColor('Yellow')

                    try {
                        const channela = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`));
                        channela.send({ embeds: [embed] })
                    } catch (error) {

                    }

                }
            } catch (error) {

            }
        }

        const fffffffff = client.db.General.get(`ConfigGeral.AntiFake.diasminimos`)

        if (fffffffff !== null) {

            const dataCriacaoConta = new Date(getCreationDateFromSnowflake(member.user.id));

            const dataAtual = new Date();

            const diferencaEmMilissegundos = dataAtual - dataCriacaoConta;

            const diasDecorridos = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

            if (diasDecorridos < fffffffff) {
                await member.kick()


                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${member.user.username}` })
                    .setTitle(`Anti-Fake`)
                    .setDescription(`Usuário foi expulso por ter uma conta com menos de \`${diasDecorridos}\` dias.`)
                    .addFields(
                        { name: `User ID`, value: `${member.user.id}`, inline: true },
                        { name: `Data de criação`, value: `<t:${Math.ceil(getCreationDateFromSnowflake(member.user.id) / 1000)}:R>`, inline: true }
                    )
                    .setFooter({
                        text: `${member.guild.name}`
                    })
                    .setTimestamp()
                    .setColor('Yellow')

                try {
                    const channela = client.channels.cache.get(client.db.General.get(`ConfigGeral.ChannelsConfig.ChangeChannelMod`));
                    channela.send({ embeds: [embed] })
                } catch (error) {

                }


            }
        }


        const ff = client.db.General.get(`ConfigGeral.AutoRole.add`)

        if (ff !== null) {

            for (const cargosadd of ff) {

                try {
                    await member.roles.add(cargosadd)
                } catch (error) {

                }


            }

        }





    }
}


function getCreationDateFromSnowflake(snowflakeId) {
    const binarySnowflake = (+snowflakeId).toString(2).padStart(64, '0'); // Convert to binary

    const timestampBinary = binarySnowflake.slice(0, 42);
    const timestampDecimal = parseInt(timestampBinary, 2);

    const creationTimestamp = timestampDecimal + 1420070400000;

    return new Date(creationTimestamp);
}