const fs = require('fs');

const {Collection} = require('discord.js');
const {prefix} = require('../config.json');

module.exports = {
    name: "proxy-manager",
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const proxy_commands = initProxyCommands('./commands/proxy/');

    if(msg.content.startsWith(prefix)) {
        const proxyArgs = msg.content.slice(prefix.length).split(' ');
        const proxyCmd = proxyArgs.shift();

        if(proxy_commands.has(proxyCmd)) {
            return proxy_commands.get(proxyCmd).execute(msg, proxyArgs, R);
        }
    }  

    return proxy_commands.get('redirect').execute();
    
}

const initProxyCommands = (path) => {
    let arr = new Collection();
    const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const command = require('./proxy/' + file);
        arr.set(command.name, command);
    }

    return arr;
}