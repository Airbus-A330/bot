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
	aliases: ["lb", "leader", "top"],
	async execute(message, args, DEFAULT, ghtoken) {
    let arr = []
    let counter = 0
    let embed = new Discord.MessageEmbed()
      .setColor(DEFAULT)
      .setDescription(`Fetching leaderboard data...`)
    let m = await message.channel.send(embed)
     const list = await db.list();
  const promises = list
    .filter(e => e.endsWith('.rep'))
    .map(async e => {
      const amount = await db.get(e);
      const user = e.replace('.rep', '');
      return { amount, user };
    });
  const d = await Promise.all(promises);
  const sorted = d.sort((a, b) => a.value - b.value)
  sorted.forEach(async s => {
    counter += 1
    if (counter == 1) {
      arr.push(`🥇 ${message.client.users.cache.get(s.user).tag} - \`${s.amount.toLocaleString()}\``)
    } else if (counter == 2) {
      arr.push(`🥈 ${message.client.users.cache.get(s.user).tag} - \`${s.amount.toLocaleString()}\``)
    } else if (counter == 3) {
      arr.push(`🥉 ${message.client.users.cache.get(s.user).tag} - \`${s.amount.toLocaleString()}\``)
    } else {
      arr.push(`**${counter}.** ${message.client.users.cache.get(s.user).tag} - \`${s.amount.toLocaleString()}\``)
    }
  })
  let finished = new Discord.MessageEmbed()
    .setTitle(`**Reputation Leaderboard**`)
    .setColor(DEFAULT)
    .setDescription(arr.join("\n"))
  m.edit(finished)
  }
};