const Discord = require('discord.js'),
    logger = require('../util/log.js'),
    util = require('util')

module.exports = {
    name: 'eval',
    description: 'Owner command that runs code',
    usage: null,
    aliases: ['e', 'evaluate', 'evaluation'],
    async execute(message, args, DEFAULT) {
        const { client } = message

        if (!client.developers.includes(message.author.id)) return

        const code = args.join(' ')

        logger.warn(
            `!eval used by ${message.author.tag} (${message.author.id})`
        )

        try {
            let evaled = await eval(code)
            const options = {
                depth: 0,
            }
            if (typeof evaled !== 'string')
                evaled = util.inspect(evaled, options)

            const embed = new Discord.MessageEmbed()
                .setColor(`#8b949e`)
                .setFooter(
                    `Executed by: ${message.author.tag}`,
                    message.author.displayAvatarURL({
                        dynamic: true,
                    })
                )
                .setTimestamp()
                .setDescription(
                    '**Output:**\n```js\n' + evaled.slice(0, 1990) + '```'
                )
            message.channel.send(embed)
        } catch (err) {
            message.channel.send(err.stack, {
                split: true,
            })
        }
    },
}
