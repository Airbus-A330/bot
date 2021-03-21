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

module.exports = {
	name: 'link',
	description: 'Link profile for verification',
	usage: null,
	aliases: ["l", "connect", "sync"],
	async execute(message, args, DEFAULT) {
		try {
			const {
				client
			} = message;
			const {
				execSync
			} = require('child_process');
			let subCommand = args[0];
			if (!subCommand) return message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(`You are missing the sub command.  Please use either \`-generate\` to generate a key or \`-verify\` to verify your account.`))
			if (subCommand == "-g" || subCommand == "-gen" || subCommand == "-generate") {
				let key = await db.get(`${message.author.id}.key`);
        let check = await db.get(`${message.author.id}.github`)
        if (check == undefined || check == null) {

        } else {
          return message.channel.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`You're already verified!`))
        }
				if (key == undefined || key == null) {
					var sequence = Buffer.from(`{ "id": "${message.author.id}", "timestamp", "${Date.now()}" }`).toString('base64')
					await db.set(`${message.author.id}.key`, sequence)
					message.author.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`To connect your GitHub account with Discord, we need to make sure it's really you  Follow the steps below for instructions on how to verify your account.  Please refer to the key below as your verification key.\n\`\`\`GitHub Discord Integration: ${sequence}\`\`\``).addField(`**Instructions:**`, `**1.** Log into your GitHub account\n**2.** Paste the verification key (as shown above) into your bio.  Make sure __all of it__ was pasted.\n**3.** Run \`git link -verify [your GitHub username here]\`\n\nIf there was an error verifying your account, the bot will let you know and retry after 15 seconds.\n\nIf you are having problems with verification, please reply to this message and our support staff will be in touch with you.`)).catch(err => {
						message.reply(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`We weren't able to DM you with your verification key and instructions.  This is usually because you either have DMs for this server off, or you have us blocked.  Please correct this issue immediately.  We're going to retry in 30 seconds.`))
						setTimeout(_ => {
							message.author.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`To connect your GitHub account with Discord, we need to make sure it's really you  Follow the steps below for instructions on how to verify your account.  Please refer to the key below as your verification key.\n\`\`\`GitHub Discord Integration: ${sequence}\`\`\``).addField(`**Instructions:**`, `**1.** Log into your GitHub account\n**2.** Paste the verification key (as shown above) into your bio.  Make sure __all of it__ was pasted.\n**3.** Run \`git link -verify [your GitHub username here]\`\n\nIf there was an error verifying your account, the bot will let you know and retry after 15 seconds.\n\nIf you are having problems with verification, please reply to this message and our support staff will be in touch with you.`)).catch(_ => {
								return;
							})
						}, 30 * 1000)
					})
					message.react("822520454622609429")
					setTimeout(async _ => {
						await db.delete(`${message.author.id}.key`)
					}, 10 * 60 * 1000);
				} else {
					message.react("822520454622609429")
					return message.author.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`You already have a valid key that is still working.  Please use it instead.\n\`\`\`GitHub Discord Integration: ${key}\`\`\``))
				}
			} else if (subCommand == "-v" || subCommand == "-verif" || subCommand == "-verify") {
				let username = args[1];
				if (!args[1]) return message.channel.send(new Discord.MessageEmbed().setColor(`RED`).setDescription(`We need your GitHub username for verification!`))
				try {
					let base = await fetch(`https://api.github.com/users/${args[1]}`, {
						method: "get"
					})
					base = await base.json()
					let check = await db.get(`${message.author.id}.github`)
					let key = await db.get(`${message.author.id}.key`)
					if (key == undefined || key == null) {
						return message.channel.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`You don't have a generated key for verification!  Generate one before running this command.`))
					}
					if (check == undefined || check == null) {
						if (base.bio.includes(`${key}`)) {
							await db.set(`${message.author.id}.github`, base)
              message.channel.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`Congratulations!  We were able to successfully verify that you own your GitHub account.  You now have the <@&821589318199279616> role as you completed the verification successfully.  Thank you!`))
							let role = message.guild.roles.cache.get("821589318199279616")
							message.member.roles.add(role, {
								reason: "Verified via Github integration"
							})
						} else {
							message.channel.send(new Discord.MessageEmbed().setDescription(`Hmm.. we couldn't verify that account belongs to you.  We'll try again in 15 seconds.`).setColor(DEFAULT))
							setTimeout(async _ => {
								if (base.bio.includes(`GitHub Discord Integration: ${key}`)) {
									await db.set(`${message.author.id}.github`, base)
									message.channel.send(`Congratulations!  You are now verified!  We have added a role to you for your efforts!`)
									let role = message.guild.roles.cache.get("821589318199279616")
									message.member.roles.add(role, {
										reason: "Verified via Github integration"
									})
								}
							}, 15000)
						}
					} else {
						return message.channel.send(new Discord.MessageEmbed().setColor(DEFAULT).setDescription(`You're already verified!`))
					}
				} catch (error) {
          console.log(error)
					message.channel.send(new Discord.MessageEmbed().setDescription(`That's not an existing GitHub username!`).setColor(DEFAULT))
				}

			}
		} catch (error) {
			console.log(error)
		}
	}
}