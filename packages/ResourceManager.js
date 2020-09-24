/**
 * Author: Guillaume ROUSSIN
 * 
 * Class:       ResourceManager
 * Description: an object capable of reading static variable and modify datasheets
 * 
 * Public functions:
 *  getDataSheet: returns a JSON object of the datasheet from a specefic guild
 *  setDataSheet: modifies the datasheet from a specific guild
 */

const fs = require('fs');

exports.ResourceManager = class {
    #REGEX

    constructor(res_path) {
        this.#REGEX = /<(\w+) name="(\w+)">([\s\S]+?)<\/\1>/gm;

        if(res_path.charAt(res_path.length-1) == '/')
        	res_path.slice(-1);

        this.loadResources(res_path);
    }

    // Retrieves XML resources and stores them in the object
    loadResources(path) {
        fs.readdirSync(path)
        .filter(file => file.endsWith('.xml'))
        .forEach(file => {
            let file_content = fs.readFileSync(`${path}/${file}`, 'utf8');
            
            // XML Parsing
            let args = file_content.match(this.#REGEX);
            if(args != null) {
                args.forEach(a => {
                    let args = this.getArgs(a);

                    // Add category if a new one appears
                    if(!this[args.type]) this[args.type] = {};

                    // Handle String to FormatString
                    if(args.type == "string")
                        this[args.type][args.name] = new exports.FormatString(args.content);
                    else
                        this[args.type][args.name] = args.content;
                });
            }
        });
    }

    // Extracts XML args from a tag
    getArgs(xml) {
        let data = (new RegExp(this.#REGEX.source, this.#REGEX.flags)).exec(xml);
        
        if(data == null) return null;
        return {type: data[1], name: data[2], content: data[3].trim()};
    }
}

/**
 * Author: Guillaume ROUSSIN
 * 
 * Class:       FormatString
 * Description: Formatable string
 * 
 * Public functions:
 *  toString:   returns the original string
 *  format:     replaces all occurences of {} in the string with a supplied argument
 */

exports.FormatString = class {
    
    constructor(string) {
        this.string = string;
    }

    toString() {
        return this.string;
    }

    // Replaces every occurence of {} with a supplied variable
    format() {
        var res = this.string;
        Array.from(arguments).forEach(n => {
            res = res.replace(/\{\}/, ""+n);
        });

        return res;
    }
}
