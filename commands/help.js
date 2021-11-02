const Discord = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Help command',
    usage: null,
    aliases: ['h', 'havish'],
    async execute(message, args, DEFAULT) {
        if (args.length !== 0) return
        let embed = new Discord.MessageEmbed()
            .setColor(DEFAULT)
            .setTitle(`**Commands**`)
            .setDescription(
                '• **`check`** - Check a GitHub object\n> **Sub Commands**\n> ‎  **`-repository`**, **`-user`**\n> **Arguments**\n> ‎ ‎• **`value`** - Value you are checking\n> **Example**\n> ‎  ‎• `git check -user Airbus-A330`\n> ‎ ‎• `git check -repo Airbus-A330/Airbus-A330`\n\n• **`link`** -  Connect a GitHub profile to your Discord\n> **Sub Commands**\n> ‎  ‎• **`-generate`** - Generate a verification key\n> ‎ ‎‎• **`-verify`** - Verify the account\n> **Arguments**\n> ‎ ‎• **`username`** - (only for -verify) your GitHub username\n> **Example**\n> ‎  ‎• `git link -generate`\n> ‎ ‎• `git link -verify Airbus-A330`\n\n• **`rep`** - Gives a user a reputation point\n> **Arguments**\n> ‎ ‎• **`user`** - User you are giving a reputation point to\n> **Example**\n> ‎  ‎• `git rep @Airbus A330-200#0001`'
            )
        message.channel.send(embed)
    },
}
