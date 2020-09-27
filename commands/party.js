const Util = require('../packages/Util');

module.exports = {
    name: 'party',
    desc: 'Donne les infos sur la prochaine soirée'
}

module.exports.execute = async (msg, args, R) => {
    const parties = await R.db.fetchAll('parties', {});
    let party;

    if(args.length != 0)
        party = parties.find(p => p.get('tag') == args[0]);

    if(party == null) party = parties.pop();

    const embed = Util.createEmbed("Soirée " + party.get('tag'), "#FFD300");

    let content = `Date: ${party.get('date')}` + "\n";
    content += `Localisation: [voir sur maps](${party.get('lieu')})` + "\n";
    content += `Budget: ${party.get('budget')}€/boisson` + "\n";

    embed.setDescription(content);
    msg.channel.send(embed);
}