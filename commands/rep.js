const Discord = require('discord.js'),
    Database = require('@replit/database'),
    db = new Database(),
    Ratelimiter = require('../ratelimiter.js'),
    hD = require('humanize-duration'),
    repHandler = new Ratelimiter({
        reset: 12 * 60 * 60 * 1000, //12 hours
        limit: 1,
    })

module.exports = {
    name: 'rep',
    description: 'Give someone reputation',
    usage: null,
    aliases: ['reputation', 'r'],
    async execute(message, args, DEFAULT, ghtoken) {
        if (!repHandler.canUse(message.author.id)) {
            const { nextReset } = repHandler.store.get(message.author.id),
                remainingTime = nextReset - Date.now(),
                embed = new Discord.MessageEmbed()
                    .setDescription(
                        `You are being ratelimited.  You can try again in **${hD(
                            remainingTime,
                            { round: true }
                        )}**.`
                    )
                    .setColor(`RED`)
            return message.channel.send(embed)
        }

        let user = args.shift()
        if (!user) {
            const embed = new Discord.MessageEmbed()
                .setDescription(
                    `Please provide a user to give a reputation point to!`
                )
                .setColor(`RED`)
            return message.channel.send(embed)
        }
        user = user.replace('<@', '').replace('!', '').replace('>', '')
        user = message.guild.member(user)

        if (!user) {
            const embed = new Discord.MessageEmbed()
                .setDescription(
                    `The person you are trying to give a reputation point to must be in this server!`
                )
                .setColor(`RED`)
            return message.channel.send(embed)
        }

        const check = await db.get(`${user.id}.rep`)
        if (!check) await db.set(`${user.id}.rep`, 0)

        const rep = await db.get(`${user.id}.rep`),
            embed = new Discord.MessageEmbed()
                .setDescription(
                    `You have successfully given ${user} **one** reputation point!`
                )
                .setColor(DEFAULT)

        await db.set(`${user.id}.rep`, parseInt(rep) + 1)
        message.channel.send(embed)
        repHandler.increment(message.author.id)
    },
}
