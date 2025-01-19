const fs = require("fs");
const path = require("path");

module.exports = {
  run: (client) => {
    //====Handler das Slahs====\\
    const SlashsArray = [];

    const comandosSlashPath = path.join(__dirname, '../ComandosSlash/');

    fs.readdir(comandosSlashPath, (erro, pasta) => {
      if (erro) return console.error(erro);
      pasta.forEach(subpasta => {
        const subpastaPath = path.join(comandosSlashPath, subpasta);
        fs.readdir(subpastaPath, (erro, arquivos) => {
          if (erro) return console.error(erro);
          arquivos.forEach(arquivo => {
            if (!arquivo.endsWith('.js')) return;
            const command = require(path.join(subpastaPath, arquivo));
            if (!command?.name) return;
            client.slashCommands.set(command.name, command);
            SlashsArray.push(command);
          });
        });
      });
    });

    client.on("ready", async () => {
      client.application.commands.set(SlashsArray);
    });
  }
};
