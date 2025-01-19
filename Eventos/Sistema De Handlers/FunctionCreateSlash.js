

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {



        if (interaction.isChatInputCommand()) {

            const cmd = client.slashCommands.get(interaction.commandName);

            if (!cmd) return interaction.reply(`Ocorreu algum erro amigo.`);

            if (!interaction.guild) return interaction.reply({ content: `Hmm... Isso não é um servidor, né?🤔`, ephemeral: true })

            interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

            cmd.run(client, interaction)

        }

        if (interaction.isMessageContextMenuCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }

        if (interaction.isUserContextMenuCommand()) {
            const command = client.slashCommands.get(interaction.commandName);
            if (command) command.run(client, interaction);
        }
    }
}