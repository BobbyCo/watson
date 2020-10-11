const Proxy = require("../../packages/Proxy");

module.exports = {
    name: "exit",
    beta: true
}

module.exports.execute = async (msg, args, R) => {

    // Find proxy
    const proxy = await Proxy.getProxyFromUser(R, msg.author.id);
        
    if(proxy != null) {

        const otherUserSrc = (proxy.get('sender') == msg.author.id) ? 'receiver' : 'sender';
        const otherUser = await Proxy.findUserDM(msg, proxy.get('server'), proxy.get(otherUserSrc));

        const x = {};
        x[otherUserSrc] = otherUser.user.id;

        const res = await R.db.delete("proxy_manager", x);

        if(!res) {
            msg.author.send(`Connection closed with **${otherUser.user.username}**`);
            otherUser.send(`Connection closed by **${msg.author.username}**`);
        }

    } else
        msg.author.send('You don\'t have any proxies set up yet.');
}