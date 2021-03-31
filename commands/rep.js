const Discord = require('discord.js');
const {
	MessageEmbed,
	Collection,
	Client
} = Discord;
const logger = require('../util/log.js');
const Database = require("@replit/database");
const db = new Database();
const fetch = require("node-fetch");
const Ratelimiter = require('../ratelimiter.js');
const hD = require("humanize-duration");
const repHandler = new Ratelimiter({
  reset: 12 * 60 * 60 * 1000, //12 hours
  limit: 1
});

module.exports = {
	name: 'rep',
	description: 'Give someone reputation',
	usage: null,
	aliases: ["reputation", "r"],
	async execute(message, args, DEFAULT, ghtoken) {
    if (!repHandler.canUse(message.author.id)) {
      var { nextReset } = repHandler.store.get(message.author.id);
			remainingTime = nextReset - Date.now();
      let embed = new Discord.MessageEmbed()
        .setDescription(`You are being ratelimited.  You can try again in **${hD(remainingTime, { round:true })}**.`)
        .setColor(`RED`);
      message.channel.send(embed);
      return;
    }
    let user = args[0];
    if (!user) {
      let embed = new Discord.MessageEmbed()
        .setDescription(`Please provide a user to give a reputation point to!`)
        .setColor(`RED`);
      message.channel.send(embed);
      return;
    }
    user = user.replace("<@", "").replace("!", "").replace(">")
    user = message.guild.member(user);
    if (user == null) {
      let embed = new Discord.MessageEmbed()
        .setDescription(`The person you are trying to give a reputation point to must be in this server!`)
        .setColor(`RED`);
      message.channel.send(embed);
      return;
    }
    let check = await db.get(`${user}.rep`);
    if (check == undefined || check == null) {
      await db.set(`${user}.rep`, 0);
    }
    let rep = await db.get(`${user}.rep`);
    await db.set(`${user}.rep`, (parseInt(rep) + 1));
    let embed = new Discord.MessageEmbed()
      .setDescription(`You have successfully given <@${user}> **one** reputation point!`)
      .setColor(DEFAULT)
    message.channel.send(embed);
  }
};