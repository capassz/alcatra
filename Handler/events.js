const fs = require('fs');
const path = require('path');

module.exports = {
    run: (client) => {
        const eventosPath = path.join(__dirname, '../Eventos');

        fs.readdirSync(eventosPath).forEach(local => {
            const localPath = path.join(eventosPath, local);
            const eventFiles = fs.readdirSync(localPath).filter(arquivo => arquivo.endsWith('.js'));
            
            for (const file of eventFiles) {
                const event = require(path.join(localPath, file));

                if (event.once) {
                    client.once(event.name, (...args) => event.run(...args, client));
                } else {
                    client.on(event.name, (...args) => event.run(...args, client));
                }
            }
        });
    }
};