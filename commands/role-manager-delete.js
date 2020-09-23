const c = require('../config.json');

module.exports = {
    name: 'delete-rm',
    desc: 'Supprime un gestionnaire',

    args: 1,
    usage: '<tag>',

    adminOnly: true,
    roles: [c.adminRole]
}

module.exports.execute = async (msg, args, R) => {
    msg.delete();
    const tag = args.shift();

    // Remove reaction
    const reacter = await R.db.fetchAll("role_managers", {tag: tag});
    console.log(reacter)
    const ids = reacter[0].get('link').split('/');

    const reactGuild = msg.client.guilds.cache.get(ids[0]);
    const reactChannel = reactGuild.channels.cache.get(ids[1])
    reactChannel.messages.fetch(ids[2]).then(m => m.reactions.cache.find(r => (r.emoji.name == reacter[0].get('emoji'))).remove());

    let res = await R.db.delete("role_managers", {tag: tag});
    if(res && res.error)
        msg.channel.send("Ce gestionnaire n'existe pas");
    else
        msg.channel.send("Gestionnaire de role `"+ tag +"` supprimé").then(r => r.delete({timeout: 2000}));
}