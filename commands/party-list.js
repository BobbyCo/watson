const Util = require('../packages/Util');
const {prefix} = require('../config.json');

module.exports = {
    name: 'list-parties',
    desc: 'Donne les infos sur la prochaine soirée'
}

module.exports.execute = async (msg, args, R) => {
    const embed = Util.createEmbed("Liste des soirées");

    const parties = await R.db.fetchAll('parties', {});

    let content = "Pour en savoir plus sur une soirée, entrez `"+ prefix +"party <tag>`." + "\n";
    content += "```" + parties.map(p => p.get('tag')).join(', ') + "```";

    embed.setDescription(content);
    msg.channel.send(embed);
}