const Util = require('../packages/Util');

module.exports = {
    name: 'del-party',
    desc: 'Donne les infos sur la prochaine soirée'
}

module.exports.execute = async (msg, args, R) => {
    msg.delete();
    
    const res = await R.db.delete('parties', {tag: args[0]});

    if(res && res.error)
        return msg.channel.send('Cette soirée n\'est pas répertoriée').then(r => r.delete({timeout: 2000}));

    msg.channel.send("La soirée `"+ args[0] +"` à étée supprimée").then(r => r.delete({timeout: 2000}));
}