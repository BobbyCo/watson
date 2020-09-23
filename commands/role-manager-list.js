const c = require('../config.json');
const {MessageEmbed} = require('discord.js');
const Util = require('../packages/Util');

module.exports = {
    name: 'list-rm',
    desc: 'Liste les gestionnaires',

    adminOnly: true,
    roles: [c.adminRole]
}

module.exports.execute = async (msg, args, R) => {
    const embed = Util.createEmbed("Gestionnaires de roles");

    const roleManagers = await R.db.fetchAll("role_managers", {});
    let text = 'pas de gestionnaires actifs';
    
    if(roleManagers.length != 0)
        text = roleManagers.map(x => x.get('tag')).join(', ');
        
    embed.setDescription("```" + text + "```");
    msg.channel.send(embed);
}