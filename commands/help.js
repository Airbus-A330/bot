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
    if (message.content.endsWith(`-modmail`)) return;
		const {
			client
		} = message;
		const {
			execSync
		} = require('child_process');
		let embed = new Discord.MessageEmbed()
			.setColor(DEFAULT)
			.setTitle(`**Commands**`)
			.setDescription("> `check` - Check a GitHub object\n>  ├─`-repository` - Check a GitHub Repository\n>  └─`-user` - Check a GitHub user\n\n> `link` - Connect a GitHub profile to your Discord \n>  ├─`-generate` - Generate a verification key\n>  └─`-verify` - Verify the account\n> `rep` - Gives a user a reputation point")
		message.channel.send(embed)
	}
}