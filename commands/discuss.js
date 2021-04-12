const Discord = require('discord.js');
const {
	MessageEmbed,
	Collection,
	Client
} = Discord;
const logger = require('../util/log.js');
const fetch = require("node-fetch");
const html2md=require('html-to-md')
const hD = require("humanize-duration");
const Ratelimiter = require("../ratelimiter.js");
const discussHandler = new Ratelimiter({
  reset: 45 * 60 * 1000, //30 mins
  limit: 2
});

module.exports = {
	name: 'discuss',
	description: 'Discuss something from the GitHub Community',
	usage: null,
	aliases: ["d"],
	async execute(message, args, DEFAULT, ghtoken) {
    args1 = message.content.replace("git discuss", "").split(" | ")
		try {
			const {
				client
			} = message;
			const {
				execSync
			} = require('child_process');
      if (!discussHandler.canUse(message.author.id)) {
        	var { nextReset } = discussHandler.store.get(message.author.id);
				  remainingTime = nextReset - Date.now();
          let embed = new Discord.MessageEmbed()
            .setDescription(`You are being ratelimited. Try again in **${hD(remainingTime, { round: true })}**.`)
            .setColor(DEFAULT)
          message.channel.send(embed);
          return;
      }
      let topic = args1[0]
      let url = args1[1]
      if (!topic) {
        let embed = new Discord.MessageEmbed()
          .setDescription(`You are missing a topic!`)
          .setColor(DEFAULT);
        message.channel.send(embed);
        return;
      }
      topic = topic.toLowerCase().replace(" ", "")
      console.log(topic)
      if (topic == "code to cloud" || topic == "github ecosystem" || topic == "github client apps" || topic == "education" || topic == "software development") { 

      } else {
        let embed = new Discord.MessageEmbed()
          .setDescription(`**Invalid Topic!**\n\nPlease choose from one of the topic lists below.\n\n> • \`code to cloud\`\n> • \`github ecosystem\`\n> • \`github client apps\`\n> • \`education\`\n> • \`software development\`\n\n**Example:**\n\`\`\`\ngit discuss code to cloud | https://github.community\`\`\``)
          .setColor(DEFAULT)
        message.channel.send(embed)
        return;
      }
      let categories = {
        "code to cloud" : "825787001344360499",
        "github ecosystem": "825787046550437909",
        "github client apps": "825787088011001866",
        "education": "825787121029349396",
        "software development": "825787157595422721"
      }
      let category = categories[topic]
      if (!url) {
        let embed = new Discord.MessageEmbed()
          .setDescription(`You are missing a URL!`)
          .setColor(DEFAULT);
        message.channel.send(embed);
        return;
      }
			let res = await fetch(`${url.replace(".json", "")}.json`);
      res = await res.json();
      let embed = new Discord.MessageEmbed()
        .setColor(DEFAULT)
        .setTitle("**" + res.title + "**")
        .setURL(`https://github.community/t/${res.post_stream.posts[0].topic_slug}/${res.post_stream.posts[0].id}`)
        .setAuthor(`${res.post_stream.posts[0].username} ${(res.post_stream.posts[0].name == res.post_stream.posts[0].username) ? "" : `(${res.post_stream.posts[0].name})`}`, `${res.post_stream.posts[0].avatar_template.toString().replace("{size}", "512")}`)
        .setDescription(`${(res.post_stream.posts[0].cooked.length > 2048) ? html2md(res.post_stream.posts[0].cooked.slice(0, 2045)) + "..." : html2md(res.post_stream.posts[0].cooked)}`)
        .setFooter(`Created at ${new Date(res.post_stream.posts[0].created_at).toLocaleString()} • Edited at ${new Date(res.last_posted_at).toLocaleString()}`)
        .setImage(res.image_url)
        .addField(`**Details:**`, `> • Views: \`${res.views.toLocaleString()}\`\n> • Likes: \`${res.like_count}\`\n> • Tags: ${(res.tags.length == 0) ? "`No tags!`" : "`" + res.tags.join("`, `") + "`"}`)

      chanTopic = `**${res.title}**\n\n • Posts: ${res.posts_count}\n • Replies: ${res.post_stream.posts[0].reply_count}\n • Highest Post Number: ${res.highest_post_number}\n\nID: ${res.post_stream.posts[0].id}`;
	      client.guilds.cache.get("811436417824718878").channels.create(res.post_stream.posts[0].topic_slug, { topic: chanTopic }).then(async c => {
          c.setParent(category).then(ch => {
            ch.lockPermissions();
          });
          c.send(`${message.author}`, embed);
          message.react("822520454622609429");
          setTimeout(async _ => {
            c.delete()
          }, 30 * 60 * 1000)
        })
      discussHandler.increment(message.author.id)
		} catch (error) {
			message.channel.stopTyping(true)
			console.log(error)
			message.channel.send(new Discord.MessageEmbed().setDescription(`Item not found.`).setColor(DEFAULT))
		}
	}
}