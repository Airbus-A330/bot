const Discord = require('discord.js');
const { MessageEmbed, Collection, Client } = Discord;
const logger = require('../util/log.js');
const Database = require("@replit/database");
const db = new Database();


module.exports = {
    name: 'link',
    description: 'Link profile for verification',
    usage: null,
    aliases: ["l", "connect"],
    async execute(message, args, DEFAULT) {
        const { client } = message;
        const { execSync } = require('child_process');
        let subCommand = args[0];
        if (subCommand == "gen" || subCommand == "generate") {
          let key = await db.get(`${message.author.id}.key`);
          if (key == undefined || key == null) {
            var sequence = Buffer.from(`{ "user_id": "${message.author.id}", "timestamp_generated", "${Date.now()}" }`).toString('base64')
            await db.set(`${message.author.id}.key`, sequence)
            message.author.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`Please paste the following into your GitHub bio below.  You have 10 minutes before the key expires.\n\`\`\`${key}\`\`\``)).catch(err => {
              message.channel.send(`${message.author}, please turn on your DMs. I will retry in 30 seconds.`)
              message.author.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`Please paste the following into your GitHub bio below.  You have 10 minutes before the key expires.\n\`\`\`${key}\`\`\``)).catch(_ => {})
            })
            setTimeout(async _ => {
              await db.delete(`${message.author.id}.key`)
            }, 10 * 60 * 1000);
          } else {
            return message.author.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`You already have a valid key that is still working.  Please use it instead.\n\`\`\`${key}\`\`\``))
          }
        } 
    }
}
