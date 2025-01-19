const { GatewayIntentBits, Client, Collection, EmbedBuilder } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const config = require('./config.json');

const events = require('./Handler/events')
const slash = require('./Handler/slash');
const fs = require('fs');
const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 15;


slash.run(client);
events.run(client);

client.slashCommands = new Collection();


process.on("unhandRejection", (reason, promise) => {
    console.log(`\x1b[31m🚫 Erro Detectado:\n\n\x1b[0m` + reason, promise);
});
process.on("uncaughtException", (error, origin) => {
    console.log(`\x1b[31m🚫 Erro Detectado:\n\n\x1b[0m` + error, origin);
});
process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.log(`\x1b[31m🚫 Erro Detectado:\n\n\x1b[0m` + error, origin);
});

client.login(config.token);

client.on("guildCreate", (guild) => {
    if (client.guilds.cache.size > 1) {
        guild.leave();
    }
});

const guildInvites = new Map();

client.on("inviteCreate", async (invite) => {
    const invites = await invite.guild.invites.fetch();

    const codeUses = new Map();
    invites.each((inv) => codeUses.set(inv.code, inv.uses));

    guildInvites.set(invite.guild.id, codeUses);
});

client.once("ready", () => {
    client.guilds.cache.forEach((guild) => {
        guild.invites
            .fetch()
            .then((invites) => {
                const codeUses = new Map();
                invites.each((inv) => codeUses.set(inv.code, inv.uses));

                guildInvites.set(guild.id, codeUses);
            })
            .catch((err) => {
            });
    });
});

client.on("guildMemberAdd", async (member) => {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.invites.fetch();

    if (!client.db.General.get("ConfigGeral.Convites")) return
    if (client.db.General.get("ConfigGeral.Convites.Status") !== null) {
        try {
            const usedInvite = newInvites.find((inv) => cachedInvites.get(inv.code) < inv.uses);
            const userCreationTimestamp = member.user.createdTimestamp;
            const currentTime = Date.now();
            const accountAge = currentTime - userCreationTimestamp;

            const millisecondsInADay = 24 * 60 * 60 * 1000;
            const days = Math.floor(accountAge / millisecondsInADay);

            if (days < 10) {
                return;
            }

            if (client.db.General.get("ConfigGeral.Convites.Cargo") !== null) {
                const guild = await client.guilds.fetch(member.guild.id);
                const user = await guild.members.fetch(usedInvite.inviterId);
                const role = guild.roles.cache.get(client.db.General.get("ConfigGeral.Convites.Cargo"));

                if (user.roles.cache.has(role.id)) {
                } else {
                    return;
                }
            }

            var tt = client.db.invite.fetchAll();
            for (let iii = 0; iii < tt.length; iii++) {
                const element = tt[iii];

                const dd = element.data.usuarios;

                if (dd.includes(member.user.id) == true) return;
            }

            client.db.invite.push(`${usedInvite.inviterId}.usuarios`, member.user.id);
            const ff = client.db.invite.get(`${usedInvite.inviterId}.sequencia`) || 0;
            client.db.invite.set(`${usedInvite.inviterId}.sequencia`, ff + 1);

            const dddd = client.db.invite.get(`${usedInvite.inviterId}.sequencia`);

            const df = client.db.General.get("ConfigGeral.Convites.qtdinvitesresgatarsaldo") || 2;
            if (Number(dddd) >= df) {
                const bb = client.db.PagamentosSaldos.get(`${usedInvite.inviterId}.SaldoAccount`) || 0;
                const dddddddd = client.db.General.get("ConfigGeral.Convites.QuantoVaiGanharPorInvites") || 0.1;
                client.db.PagamentosSaldos.set(`${usedInvite.inviterId}.SaldoAccount`, Number(bb) + Number(dddddddd));

                client.db.invite.set(`${usedInvite.inviterId}.sequencia`, 0);
            }
        } catch (err) {
        }

        newInvites.each((inv) => cachedInvites.set(inv.code, inv.uses));
        guildInvites.set(member.guild.id, cachedInvites);
    }
});