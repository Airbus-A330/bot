const Discord = require('discord.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
    name: 'rep',
    description: 'Give someone reputation',
    usage: null,
    aliases: ['lb', 'leader', 'top'],
    async execute(message, args, DEFAULT, ghtoken) {
        const arr = [],
            embed = new Discord.MessageEmbed()
                .setColor(DEFAULT)
                .setDescription(`Fetching leaderboard data...`),
            m = await message.channel.send(embed),
            list = await db.list(),
            promises = list
                .filter((e) => e.endsWith('.rep'))
                .map(async (e) => {
                    return {
                        amount: await db.get(e),
                        user: e.replace('.rep', ''),
                    }
                }),
            d = await Promise.all(promises),
            sorted = d.sort((a, b) => a.value - b.value)

        let counter = 0

        for (const s of sorted) {
            switch (++counter) {
                case 1:
                    arr.push(
                        `🥇 ${message.client.users.cache.get(s.user).tag} - \`${
                            s.amount
                        }\``
                    )
                case 2:
                    arr.push(
                        `🥈 ${message.client.users.cache.get(s.user).tag} - \`${
                            s.amount
                        }\``
                    )
                case 3:
                    arr.push(
                        `🥉 ${message.client.users.cache.get(s.user).tag} - \`${
                            s.amount
                        }\``
                    )
                default:
                    arr.push(
                        `**${counter}.** ${
                            message.client.users.cache.get(s.user).tag
                        } - \`${s.amount}\``
                    )
            }
        }

        const finished = new Discord.MessageEmbed()
            .setTitle(`**Reputation Leaderboard**`)
            .setColor(DEFAULT)
            .setDescription(arr.join('\n'))

        m.edit(finished)
    },
}
