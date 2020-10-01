const ID_SERVEUR = '688064434983272479';

module.exports = {
    name: "dm",
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    const id = args.shift();
    const message = args.join(' ');
    
    console.log(id, message);

    const guild = await msg.client.guilds.fetch(ID_SERVEUR);
    const member = await guild.members.cache.find(m => m.id == id);

    console.log(member);

    member.send(message);
}

