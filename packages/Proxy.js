module.exports.findUserDM = async (msg, guild_id, user_id) => {
    const guild = await msg.client.guilds.fetch(guild_id);
    const member = await guild.members.fetch(user_id);

    return member;
}

module.exports.getProxyFromUser = async (R, id) => {
    const curProxies = await R.db.fetchAll('proxy_manager', {});

    const sendProxy = curProxies.filter(x => x.get('sender') == id);
    const receiveProxy = curProxies.filter(x => x.get('receiver') == id);

    return (sendProxy.length != 0) ? sendProxy[0] : ((receiveProxy.length != 0) ? receiveProxy[0] : null);
}