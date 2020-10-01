module.exports = {
    name: "purge",
    beta: true
}

module.exports.execute = async (msg, args, R) => {
    if(msg.channel.type === "dm") msg.channel.bulkDelete(5);
}

