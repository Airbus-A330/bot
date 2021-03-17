const Discord = require('discord.js');
const {
	MessageEmbed,
	Collection,
	Client
} = Discord;
const logger = require('../util/log.js');
const fetch = require("node-fetch");

module.exports = {
	name: 'check',
	description: 'Checkout some git stuff',
	usage: null,
	aliases: ["c", "checkout"],
	async execute(message, args, DEFAULT) {
		try {
			const {
				client
			} = message;
			const {
				execSync
			} = require('child_process');
			const commandType = args[0]
			if (!args[1]) return;
			message.channel.startTyping()
			if (commandType == "-user") {
				let base = await fetch(`https://api.github.com/users/${args[1]}`, {
					method: "get"
				})
				let orgs = await fetch(`https://api.github.com/users/${args[1]}/orgs`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				let followers = await fetch(`https://api.github.com/users/${args[1]}/followers`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				let following = await fetch(`https://api.github.com/users/${args[1]}/following`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				base = await base.json()
				orgs = await orgs.json()
				console.log(orgs)
				followers = await followers.json()
				following = await following.json()
				let embed = new Discord.MessageEmbed()
					.setColor(DEFAULT)
					.setFooter(`Created at ${new Date(base.created_at).toLocaleString()} | Last updated at ${new Date(base.updated_at).toLocaleString()}`)
					.setTitle(`**${(base.login == base.name || base.name == null || base.name == undefined) ? base.login : base.login + " (" + base.name + ")"}**`)
					.setURL(`https://github.com/${base.login}`)
					.setThumbnail(base.avatar_url)
					.setDescription(`${base.bio == undefined || base.bio == null ? "" : "```" + base.bio + "```\n"}[${base.followers.toLocaleString()}](https://github.com/${base.login}?tab=followers) Followers • [${base.following.toLocaleString()}](https://github.com/${base.login}?tab=following) Following\n${(base.company == undefined || base.company == null) ? "`" + base.login + " doesn't work anywhere!`" : (base.company.split(" ").length == 2) ? "Works at `" + base.company.split(" ").join(" & ") + "`" : (base.company.split(" ").length > 2) ? "Works at `" + base.company.split(" ").join(", ").split(", ").reverse().replace(", ", " & ").split(", ").reverse().join(", ") + "`" : "Works at `" + base.company + "`"}\n${(base.twitter_username == null || base.twitter_username == undefined) ? "" : "[" + base.login + "'s Twitter](https://twitter.com" + base.twitter_username + ")\n"} ${(base.blog == undefined || base.blog == null || base.blog == "") ? "" : "[" + base.login + "'s website](https://" + base.blog + ")\n"}`)
				let str = ""
				if (followers.length > 10) {
					for (f = 0; f < 10; f++) {
						str += `• [${followers[f].login}](${followers[f].html_url})\n`
					}
					str += "And " + (((base.followers) - 10)).toLocaleString() + " more..."
				} else {
					followers.forEach(f => {
						str += `• [${f.login}](${f.html_url})\n`
					})
				}
				if (str == "") str = `${base.login} doesn't have any followers!`
				embed.addField(`**Followers [${base.followers.toLocaleString()}]:**`, str, true)
				let str1 = ""
				if (following.length > 10) {
					for (f = 0; f < 10; f++) {
						str1 += `• [${following[f].login}](${following[f].html_url})\n`
					}
					str1 += "And " + (((base.following) - 10)).toLocaleString() + " more..."
				} else {
					following.forEach(f => {
						str1 += `• [${f.login}](${f.html_url})\n`
					})
				}
				if (str1 == "") str1 = `${base.login} isn't following anyone!`
				embed.addField(`**Following [${base.following.toLocaleString()}]:**`, str1, true)
				if (orgs == undefined || orgs == null || orgs.length == 0) {
					embed.addField(`**Organizations [0]:**`, `‎${base.login} isn't part of any organizations!`, true)
				} else {
					let final = "";
					orgs.forEach(o => {
						final += `• [${o.login}](${o.url})\n`
					})
					embed.addField(`**Organizations [${orgs.length}]:**`, "‎" + final, true)
				}
				message.channel.stopTyping(true)
				message.channel.send(embed)
			} else if (commandType == "-repo" || commandType == "-repository") {
				let base = await fetch(`https://api.github.com/repos/${args[1]}`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				base = await base.json()
				let stars = await fetch(`https://api.github.com/repos/${args[1]}/stargazers`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				let contributors = await fetch(`https://api.github.com/repos/${args[1]}/contributors`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				let forks = await fetch(`https://api.github.com/repos/${args[1]}/forks`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
				stars = await stars.json()
				contributors = await contributors.json()
				forks = await forks.json()
				let embed = new Discord.MessageEmbed()
					.setColor(DEFAULT)
					.setFooter(`Created at ${new Date(base.created_at).toLocaleString()} | Last updated at ${new Date(base.updated_at).toLocaleString()}`)
					.setAuthor(base.owner.login, base.owner.avatar_url)
					.setTitle(`**${(base.private == true) ? client.emojis.cache.get("821537741237780540").toString() + " " : ""}‎${(base.fork == true) ? client.emojis.cache.get("821571148155191297").toString() + " " : ""}‎${base.name}**`)
					.setURL(base.html_url)
					.setDescription(`${(base.description == null || base.description == undefined || base.description == "") ? "" : "```" + base.description + "```\n"}[${base.stargazers_count.toLocaleString()}](https://github.com/${args[1]}/stargazers) Star${(base.stargazers_count == 1) ? "" : "s" } • [${base.watchers_count.toLocaleString()}](https://github.com/${args[1]}/watchers) Watcher${(base.watchers_count == 1) ? "" : "s"} • [${base.forks_count.toLocaleString()}](https://github.com/${args[1]}/network/members) Fork${(base.forks_count == 1) ? "" : "s"}\n[${base.open_issues_count.toLocaleString()}](https://github.com/discord/discord-api-docs/issues) Open Issue${(base.open_issues_count == 1) ? "" : "s"}\n${(base.license == null) ? "`This repository has no license!`" : "License: [`" + base.license.name + "`](https://github.com/" + args[1] + "/blob/master/LICENSE)"}`)

				if (base.license == null) {
					embed.addField(`**License:**`, "This repository does not have a license!")
				} else if (base.license.key == "other"){
          embed.addField(`**License:**`, "This license is listed under the `Other` category. That's all we know.")
        } else {
          let license = await fetch(`https://api.github.com/licenses/${base.license.key}`, {
					method: "get",
					headers: {
						"Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
					}
				})
        license = await license.json()
					string = ""
					string += `• Description: \`${license.description}\`\n• Permissions: \`${license.permissions.join(", ")}\`\n• Conditions: 
              \`${license.conditions.join(", ")}\`\n• Limitations: \`${license.limitations.join(", ")}\``
					embed.addField(`**License:**`, string)
				}
				let str = ""
				if (stars.length > 10) {
					for (i = 0; i < 10; i++) {
						str += `• [${stars[i].login}](${stars[i].html_url})\n`
					}
					str += `And ${((base.stargazers_count) - 10).toLocaleString()} more...`
				} else {
					str += `• [${stars.login}](${stars.html_url})\n`
				}
				if (stars.length == 0) {
					embed.addField(`**Stargazers [${(base.stargazers_count).toLocaleString()}]:**`, "This repository has no stars!", true)
				} else {
					embed.addField(`**Stargazers [${(base.stargazers_count).toLocaleString()}]:**`, str, true)
				}
				let str1 = ""
				if (contributors.length > 10) {
					for (i = 0; i < 10; i++) {
						str1 += `• [${contributors[i].login}](${contributors[i].html_url})\n`
					}
					str1 += `And ${((contributors.length) - 10).toLocaleString()} more...`
				} else {
					str1 += `• [${contributors.login}](${contributors.html_url})\n`
				}
				if (contributors.length == 0) {
					embed.addField(`**Contributors [${(contributors.length).toLocaleString()}]:**`, "This repository has no contributors!", true)
				} else {
					embed.addField(`**Contributors [${(contributors.length).toLocaleString()}]:**`, str1, true)
				}

				let str2 = ""
				if (forks.length > 10) {
					for (i = 0; i < 10; i++) {
						str2 += `• [${forks[i].full_name}](${forks[i].html_url})\n`
					}
					str2 += `And ${((base.forks_count) - 10).toLocaleString()} more...`
				} else {
					str2 += `• [${forks.login}](${forks.html_url})\n`
				}
				if (forks.length == 0) {
					embed.addField(`**Forks [${(base.forks_count).toLocaleString()}]:**`, "This repository has no forks!", true)
				} else {
					embed.addField(`**Forks [${(base.forks_count).toLocaleString()}]:**`, str2, true)
				}
				message.channel.stopTyping(true)
				message.channel.send(embed)
			}
		} catch (error) {
			message.channel.stopTyping(true)
			console.log(error)
			message.channel.send(new Discord.MessageEmbed().setDescription(`Item not found.`).setColor(DEFAULT))
		}
	}
}