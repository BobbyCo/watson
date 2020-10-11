const { Message } = require('discord.js');
const Util = require('../../packages/Util');
const Proxy = require('../../packages/Proxy');

module.exports = {
    name: "connect",
    beta: true
}

const GUILDS = {
    "GEII": '688064434983272479',
    "MACRONIE": '644233511909326859',
    "BIP": '689535601615306832'
}

const MESSAGE_SUCCESS = "Connection established. Your messages are now being redirected.";

module.exports.execute = async (msg, args, R) => {
    if(msg.author.bot) return;

    const guild_id = GUILDS[args.shift()];
    const member_tag = args.join(' ');

    const member = await Proxy.findUserDM(msg, guild_id, member_tag);
    
    if(member == null)
        return msg.reply("Cannot find user");

    if(member.user.id == msg.author.id)
        return msg.reply('You can\'t open a proxy with yourself');

    if(Proxy.getProxyFromUser(R, member.user.id) == null)
        return msg.author.send("This user is currently unreachable");

    else if (Proxy.getProxyFromUser(R, msg.author.id) == null)
        return msg.author.send("You already have an open proxy, close it to start it a new one");

    else
        msg.author.send(`Connecting to **${member.user.username}** ...`)

    const requestMsg = `**${msg.author.username}** would like to connect with you.`;
    const dmMsg = await member.send(requestMsg);
    
    const collected = await Util.getDMInput(dmMsg.channel, member, "Accept request ? (yes/no)", /(yes|no)/gm);
    if(collected == "yes") {
        const res = await R.db.insert('proxy_manager', {sender: msg.author.id, receiver: member.user.id, server: guild_id});
        
        if(!res.error) {
            msg.author.send(MESSAGE_SUCCESS);
            member.send(MESSAGE_SUCCESS);
        }
    } else {
        console.log(collected);
        msg.author.send("Connection refused.")
    }
}