const Discord = require('discord.js');
const {
	MessageEmbed,
	Collection,
	Client
} = Discord;
const logger = require('../util/log.js');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
	name: 'help',
	description: 'Help command',
	usage: null,
	aliases: ["h", "havish"],
	async execute(message, args, DEFAULT) {
    if (args.length !== 0) return;
		const {
			client
		} = message;
		const {
			execSync
		} = require('child_process');
		let embed = new Discord.MessageEmbed()
			.setColor(DEFAULT)
			.setTitle(`**Commands**`)
			.setDescription("• **`check`** - Check a GitHub object\n> **Sub Commands**\n> ‎  **`-repository`**, **`-user`**\n> **Arguments**\n> ‎ ‎• **`value`** - Value you are checking\n> **Example**\n> ‎  ‎• `git check -user Airbus-A330`\n> ‎ ‎• `git check -repo Airbus-A330/Airbus-A330`\n\n• **`link`** -  Connect a GitHub profile to your Discord\n> **Sub Commands**\n> ‎  ‎• **`-generate`** - Generate a verification key\n> ‎ ‎‎• **`-verify`** - Verify the account\n> **Arguments**\n> ‎ ‎• **`username`** - (only for -verify) your GitHub username\n> **Example**\n> ‎  ‎• `git link -generate`\n> ‎ ‎• `git link -verify Airbus-A330`\n\n• **`rep`** - Gives a user a reputation point\n> **Arguments**\n> ‎ ‎• **`user`** - User you are giving a reputation point to\n> **Example**\n> ‎  ‎• `git rep @Airbus A330-200#0001`")
      /*
      .addField("**`check`** - Check a GitHub object", "_ _")
      .addField("> Sub Commands", "**`-repository`**, **`-user`**")
      .addField("> Arguments", "**`value`**")
      //.addField(`> Examples`, "**`git check -user Airbus-A330`**, **`git check -repository Airbus-A330/Airbus-A330`**")
      .addField("_ _", "_ _")
      .addField("**`link`** - Connect a GitHub profile to your Discord", "_ _")
      .addField("> Sub Commands", "**`-generate`**, **`-verify`**")
      .addField("> Arguments", "**`username (only for -verify)`**")
      //.addField(`> Examples`, "**`git link -generate`**, **`git link -verify Airbus-A330`**")
      .addField("_ _", "_ _")
      .addField("**`rep`** - Gives a user a reputation point", "_ _")
      .addField("> Arguments", "**`user`**")
      //.addField("> Example", "**`git rep @Airbus A330-200#0001`**")*/
		message.channel.send(embed)
	}
}