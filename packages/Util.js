const {MessageEmbed} = require('discord.js');

module.exports = class {
    static async getUserInput(msg, question, format = /.+/g) {
        return this.getDMInput(msg.channel, msg.author, question, format);
    }

    static async getDMInput(channel, author, question, format = /.+/g) {
        const f = m => (m.author == author);
        
        channel.send(question);
        
        try {
            let answers = await channel.awaitMessages(f, { max: 1, time: 300000, errors: ['time'] });
            let content = answers.first().content
            if(!content.match(format)) {
                channel.send("**Error:** Wrong format !");
                return await this.getDMInput(channel, author, question, format);
            } else
                return content;
        } catch(e) {
            return "";
        }
    }

    static formatList(names, descs, pattern) {

        if(names.length == 0) return "";

        let text = "";
        const length = names.slice(0).sort((a,b) => (b.length - a.length))[0].length;
    
        names.forEach((n, i) => {
            text += this.formatString(pattern, (n + this.genSpaces(length-n.length)), descs[i]) + "\n";
        })
    
        return text;
    }

    static genSpaces(n) {
        let spaces = "";
        for(let i = 0; i < n; i++) {
            spaces += " ";
        }
        return spaces;
    }

    static createEmbed(title, color = '#000', hasAuthor = false, bot = {}) {
        const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(color);

        if(hasAuthor) {
            embed.setAuthor(bot.user.username, bot.user.avatarURL());
        }

        return embed;
    }

    static formatString(string) {
        const args = Array.prototype.slice.call(arguments, 1);

        return string.replace(/{(\d+)}/g, (match, n) => {
            return (typeof args[n] != undefined) ? args[n] : match;
        });
    }


}