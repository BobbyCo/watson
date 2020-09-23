const c = require('../config.json');
const Util = require('../packages/Util');

module.exports = {
    name: 'find-rm',
    desc: 'trouve un gestionnaire',

    args: 1,
    usage: '<tag>',

    adminOnly: true,
    roles: [c.adminRole]
}

module.exports.execute = async (msg, args, R) => {
    const roleManager = await R.db.fetchAll("role_managers", {tag: args[0]});

    msg.channel.send("https://discordapp.com/channels/" + roleManager[0].get('link'));
}