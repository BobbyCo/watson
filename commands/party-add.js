const Util = require('../packages/Util');

module.exports = {
    name: 'add-party',
    desc: 'Donne les infos sur la prochaine soirée'
}

module.exports.execute = async (msg, args, R) => {
    msg.delete();

    await R.db.insert('parties', {
        tag: args[0],
        date: args[1], 
        lieu: args[2],
        budget: args[3]
    });

    msg.channel.send("La soirée `"+ args[0] +"` à étée ajoutée").then(r => r.delete({timeout: 5000}));
}