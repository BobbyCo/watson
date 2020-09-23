const conf = require('../config.json');
const Util = require('../packages/Util');

module.exports = {
    name: "admin-help",
    beta: true,

    adminOnly: true,
    roles: [conf.adminRole, conf.commandRole, conf.userRole]
}

module.exports.execute = async (msg, args, R) => {
    const embed = Util.createEmbed("Admin Help", '#000', true, msg.client);

    const adminCommands = msg.client.commands.filter(c => (!c.beta && c.adminOnly))
    
    // Filtering admin commands
    const userRole = getUserHighestRole(msg.member);
    const commands = adminCommands.filter(c => c.roles.includes(userRole));

    const names = commands.map(c => c.name);
    const descs = commands.map(c => c.desc);
    
    embed.setDescription(R.string.helpAdminText.format(userRole, conf.prefix));
    embed.addField(R.string.helpTitle.format(), "\n```md\n" + Util.formatList(names, descs, "- {0}    {1}") + "\n```");

    msg.channel.send(embed);
}

const getUserHighestRole = (member) => {
    for(r of module.exports.roles) {
        if(member.roles.cache.some(role => role.name == r)) return r;
    };
    return module.exports.roles[0];
}