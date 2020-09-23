const {prefix} = require('../config.json');
const Util = require('../packages/Util');

module.exports = {
    name: "help",
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const embed = Util.createEmbed("Help", '#000', true, msg.client);

    const commands = msg.client.commands.filter(c => (!c.beta && !c.adminOnly));
    const names = commands.map(c => c.name);
    const descs = commands.map(c => c.desc);
    
    embed.setDescription(R.string.helpText.format(prefix));

    if(names.length && descs.length) 
        embed.addField(R.string.helpTitle.format(), "\n```md\n" + Util.formatList(names, descs, "- {0}    {1}") + "\n```");
    else
        embed.addField(R.string.helpTitle.format(), "```Il n'y a pas de commandes tous publics actuellement```")

    msg.channel.send(embed);
}

