const { Message } = require('discord.js');
const Util = require('../../packages/Util');
const Proxy = require('../../packages/Proxy');

module.exports = {
    name: "connect",
    beta: true
}

const MESSAGE_SUCCESS = "Connection established. Your messages are now being redirected.";

module.exports.execute = async (msg, args, R) => {
    if(msg.author.bot) return;

    const guild_id = args[0];
    const member_id = args[1];

    if(Proxy.getProxyFromUser(R, member_id) == null)
        return msg.author.send("This user is currently unreachable");

    else if (Proxy.getProxyFromUser(R, msg.author.id) == null)
        return msg.author.send("You already have an open proxy, close it to start it a new one");

    else
        msg.author.send("Connecting ...")

    if(member_id == msg.author.id)
        return msg.reply('You can\'t open a proxy with yourself');

    const member = await Proxy.findUserDM(msg, guild_id, member_id);

    const requestMsg = `**Proxy request :** *${msg.author.username}* would like to connect with you.`;
    const dmMsg = await member.send(requestMsg);
    
    const collected = await Util.getDMInput(dmMsg.channel, member, "Accept request ? (yes/no)", /(yes|no)/gm);
    if(collected == "yes") {
        const res = await R.db.insert('proxy_manager', {sender: msg.author.id, receiver: member_id, server: guild_id});
        
        if(!res.error) {
            msg.author.send(MESSAGE_SUCCESS);
            member.send(MESSAGE_SUCCESS);
        }
    } else {
        msg.author.send("Connection refused.")
    }
}