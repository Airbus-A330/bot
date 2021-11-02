const Discord = require('discord.js'),
    fetch = require('node-fetch'),
    html2md = require('html-to-md'),
    hD = require('humanize-duration'),
    Ratelimiter = require('../util/ratelimiter.js'),
    discussHandler = new Ratelimiter({
        reset: 45 * 60 * 1000, //30 mins
        limit: 2,
    }),
    categories = {
        'code to cloud': '825787001344360499',
        'github ecosystem': '825787046550437909',
        'github client apps': '825787088011001866',
        education: '825787121029349396',
        'software development': '825787157595422721',
    },
    { sleep } = require('../util/index')

module.exports = {
    name: 'disabled-discuss',
    description: 'Discuss something from the GitHub Community',
    usage: null,
    aliases: ['d'],
    async execute(message, args, DEFAULT, ghtoken) {
        const args = message.content.replace('git discuss', '').split(' | ')
        try {
            const { client } = message
            if (!discussHandler.canUse(message.author.id)) {
                var { nextReset } = discussHandler.store.get(message.author.id)
                remainingTime = nextReset - Date.now()
                let embed = new Discord.MessageEmbed()
                    .setDescription(
                        `You are being ratelimited. Try again in **${hD(
                            remainingTime,
                            { round: true }
                        )}**.`
                    )
                    .setColor(DEFAULT)
                return message.channel.send(embed)
            }
            const topic = args.shift().toLowerCase(),
                url = args.shift()

            if (!topic) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`You are missing a topic!`)
                    .setColor(DEFAULT)
                return message.channel.send(embed)
            }

            if (!Object.keys(categories).includes(topic)) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(
                        `**Invalid Topic!**\n\nPlease choose from one of the topic lists below.\n\n> • \`code to cloud\`\n> • \`github ecosystem\`\n> • \`github client apps\`\n> • \`education\`\n> • \`software development\`\n\n**Example:**\n\`\`\`\ngit discuss code to cloud | https://github.community\`\`\``
                    )
                    .setColor(DEFAULT)
                return message.channel.send(embed)
            }

            const category = categories[topic]
            if (!url) {
                const embed = new Discord.MessageEmbed()
                    .setDescription(`You are missing a URL!`)
                    .setColor(DEFAULT)
                return message.channel.send(embed)
            }
            const res = await (
                    await fetch(`${url.replace('.json', '')}.json`)
                ).json(),
                post = res.post_stream.posts[0],
                embed = new Discord.MessageEmbed()
                    .setColor(DEFAULT)
                    .setTitle(`**${res.title}**`)
                    .setURL(
                        `https://github.community/t/${post.topic_slug}/${post.id}`
                    )
                    .setAuthor(
                        `${post.username} ${
                            post.name === post.username ? '' : `(${post.name})`
                        }`,
                        `${post.avatar_template
                            .toString()
                            .replace('{size}', '512')}`
                    )
                    .setDescription(
                        `${
                            post.cooked.length > 2048
                                ? html2md(
                                      post.cooked.slice(0, 2048 - '...'.length)
                                  ) + '...'
                                : html2md(post.cooked)
                        }`
                    )
                    .setFooter(
                        `Created at ${new Date(
                            post.created_at
                        ).toLocaleString()} • Edited at ${new Date(
                            res.last_posted_at
                        ).toLocaleString()}`
                    )
                    .setImage(res.image_url)
                    .addField(
                        `**Details:**`,
                        `> • Views: \`${res.views.toLocaleString()}\`\n> • Likes: \`${
                            res.like_count
                        }\`\n> • Tags: ${
                            !res.tags
                                ? '`No tags!`'
                                : `\`${res.tags.join('`, `')}\``
                        }`
                    ),
                chanTopic = `**${res.title}**\n\n • Posts: ${res.posts_count}\n • Replies: ${post.reply_count}\n • Highest Post Number: ${res.highest_post_number}\n\nID: ${post.id}`

            const c = await client.guilds.cache
                    .get('811436417824718878')
                    .channels.create(post.topic_slug, {
                        topic: chanTopic,
                    }),
                ch = await c.setParent(category)

            ch.lockPermissions()
            c.send(`${message.author}`, embed)
            message.react('822520454622609429')

            await sleep(30 * 60 * 1000)
            await c.delete()
            discussHandler.increment(message.author.id)
        } catch (error) {
            message.channel.stopTyping(true)
            console.log(error)
            message.channel.send(
                new Discord.MessageEmbed()
                    .setDescription(`Item not found.`)
                    .setColor(DEFAULT)
            )
        }
    },
}
