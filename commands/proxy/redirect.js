const Proxy = require('../../packages/Proxy');

module.exports = {
    name: "redirect",
    beta: true
}

module.exports.execute = async (msg, R) => {
    const proxy = await Proxy.getProxyFromUser(R, msg.author.id);

    if(proxy == null)
        return msg.author.send("You don't have any open proxies");
    
    const otherUserSrc = (proxy.get('sender') == msg.author.id) ? 'receiver' : 'sender';
    const otherUser = await Proxy.findUserDM(msg, proxy.get('server'), proxy.get(otherUserSrc));

    otherUser.send(msg.content);
}