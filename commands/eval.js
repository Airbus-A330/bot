const Discord = require('discord.js');
const { MessageEmbed, Collection, Client } = Discord;
const logger = require('../util/log.js');

module.exports = {
    name: 'eval',
    description: 'Owner command that runs code',
    usage: null,
    async execute(message, args) {
        const { client } = message;
        const { execSync } = require('child_process');
        
        if (!client.developers.includes(message.author.id)) return;

        const code = message.content.split(' ').slice(1).join(' ')

        logger.warn(`!eval used by ${message.author.tag} (${message.author.id})`)

        try {
            let evaled = await eval(code);
            const options = { 
   depth: 0
}
            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, options);
            }


            const embed = new MessageEmbed()
                .setColor(`#8b949e`)
                .setFooter(`Executed by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setDescription("**Output:**\n```JS\n" + evaled.slice(0, 1990) + "```");
                // (evaled.length < 1985) ? message.channel.send("**Output:**\n" + "```JS\n" + evaled + "\n```") : message.channel.send("**Output:**\n" + "```JS\n" + evaled.slice(0, 1982) + "...\n```")
            message.channel.send(embed)
        } catch (err) {
            const embed = new MessageEmbed()
                .setTitle(`**Error:**`)
                .setTimestamp()
                .setColor(`RED`)
                .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .addField(`**📥 Input:**`, '```JS\n' + code + '```')
                .addField(`**📤 Output:**`, '```JS\n' + err + '```')

            message.channel.send(err.stack, {split:true});
        }
    }
}
