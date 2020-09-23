module.exports = {
    name: "role_modify",
    desc: "Adds or removes a role in response to a rection to a specific message"
}

module.exports.execute = async (action, reaction, user, R) => {
    const msg = reaction.message;

    const post_id = msg.guild.id + "/" + msg.channel.id + "/" + msg.id;
    const reactListeners = await R.db.fetchAll("role_managers", {link: post_id});

    if(reactListeners.length == 0)
        return;

    const role = reactListeners.filter(f => (f.get('emoji') == reaction.emoji.name));
    if(role.length != 0) {
        const member = msg.guild.members.cache.get(user.id);
        if(action == "add")
            member.roles.add(role[0].role);
        else
            member.roles.remove(role[0].role);
    }
}