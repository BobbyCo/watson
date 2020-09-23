const c = require('../config.json');

module.exports = {
    name: 'add-rm',
    desc: 'Ajoute un gestionnaire',

    args: 4,
    usage: '<tag> <emoji> <role> <link>',

    adminOnly: true,
    roles: [c.adminRole]
}

module.exports.execute = async (msg, args, R) => {
    msg.delete();

    const tag = args.shift();
    const emoji = args.shift();
    const role = args.shift();
    const link = args.shift();

    const post_id = link.split('/').filter(x => !isNaN(x)).join('/').slice(1);
    const ids = post_id.split('/');

    const reactChannel = msg.guild.channels.cache.get(ids[1])
    if(reactChannel.type === "text") {
        reactChannel.messages.fetch(ids[2]).then(m => m.react(emoji));
    } else {
        msg.channel.send("Faut mettre un lien en rapport avec un message");
    }

    await R.db.insert("role_managers", {tag: tag, link: post_id, emoji: emoji, role: role.slice(3,-1)});
    msg.channel.send("Gestionnaire de role `"+ tag +"` ajouté").then(r => r.delete({timeout: 2000}));
}