const fs = require('fs');
const rm = require('./packages/ResourceManager');
const dbm = require('./packages/DatabaseManager');

const Discord = require('discord.js');
const {prefix, status, token} = require('./config.json');

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const R = new rm.ResourceManager(__dirname+'/res/');
const db = new dbm.DatabaseManager(__dirname+'/models/');

// Appending the database to the ressourceManager
R.db = db;

// Loading commands
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require('./commands/' + file);
    bot.commands.set(command.name, command);
}

// Loading reaction managers
bot.reacters = [];
const reactFiles = fs.readdirSync('./reaction_managers/').filter(file => file.endsWith('.js'));

for(const file of reactFiles) {
    bot.reacters.push( require('./reaction_managers/' + file) );
}

// Startup + Ressource loading
bot.on("ready", () => {
    console.log(bot.user.username + " is online !");
    bot.user.setPresence({
        status: 'online',
        game: {
            name: status,
            type: "PLAYING"
        }
    });
});

// Create new role on join
bot.on('guildCreate', (guild) => {
    console.log("I joined a guild !");
});

bot.on("messageReactionAdd", async (r, user) => {
    if(user.bot) return;

    bot.reacters.forEach(reacter => {
        reacter.execute("add", r, user, R);
    });
});

bot.on("messageReactionRemove", async (r, user) => {
    if(user.bot) return;

    bot.reacters.forEach(reacter => {
        reacter.execute("remove", r, user, R);
    });
});

// Dynamic command processing
bot.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Check that the command exists
    if (!bot.commands.has(commandName))
        return msg.channel.send(R.string.errorCommandNotFound.format(commandName));

    const command = bot.commands.get(commandName);

    // Check admin rights
    if(command.adminOnly) {
        const isAdmin = hasAdminRole(msg.member, command.roles);
        if(!isAdmin) return msg.channel.send(R.string.errorNoRole.format());
    }

    // Check the command can be ran in DMs
    if (command.guildOnly && msg.channel.type !== 'text')
        return msg.reply(R.string.errorNoDM.format());

    // Arg count check
    let x = checkArgs(command, args);
    if(x != 0) {
        let reply = "";

        if(x == 1)
            reply += 'Mauvais nombre d\'arguments !\n';
        
        if(command.usage)
            reply += `Usage: \`${prefix}${commandName} ${command.usage}\``;

        if(!command.usage && x == 2)
            reply += 'Pas d\'arguments requis';

        return msg.channel.send(reply);
    }

    // Execute command
    try {
        command.execute(msg, args, R);
    } catch (error) {
        console.error(error);
        msg.channel.send(R.string.errorExec.format());
    }
});

const checkArgs = (cmd, args) => {
    if(args[0] == '?')
        return 2;
    else if(!cmd.args)
        return 0;

    if(cmd.args > 0)
        return !(args.length == cmd.args);
    else
        return !(args.length >= -cmd.args);
}

const hasAdminRole = (member, roles) => {
    let hasRole = false;
    roles.forEach(role => {
        if(member.roles.cache.some(r => r.name == role)) hasRole = true;
    })
    return hasRole;
}

bot.login(token);