module.exports.findUserDM = async (msg, guild_id, user_tag) => {
    const args = user_tag.split('#');
    let f;

    if(args.length == 1)
        f = x => (x.user.id == args[0]);
    else
        f = x => (x.user.username == args[0] && x.user.discriminator == args[1]);

    const guild = await msg.client.guilds.fetch(guild_id);
    const member = await guild.members.cache.filter(f);

    return (member.size != 0) ? member.first() : null;
}



module.exports.getProxyFromUser = async (R, id) => {
    const curProxies = await R.db.fetchAll('proxy_manager', {});

    const sendProxy = curProxies.filter(x => x.get('sender') == id);
    const receiveProxy = curProxies.filter(x => x.get('receiver') == id);

    return (sendProxy.length != 0) ? sendProxy[0] : ((receiveProxy.length != 0) ? receiveProxy[0] : null);
}