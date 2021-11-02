const fs = require('fs'),
    fetch = require('node-fetch'),
    { prefix, status, DEFAULT } = require('./config.json'),
    logger = require('./util/log.js'),
    Discord = require('discord.js'),
    { sleep } = require('./util/index.js'),
    client = new Discord.Client(),
    snipe = {
        message: null,
        attachments: null,
    },
    commandFiles = fs
        .readdirSync('./commands')
        .filter((file) => file.endsWith('.js')),
    iconList = [
        `https://media.discordapp.net/attachments/811437321593290804/812091804811657276/GitHub-Mark.png`,
        `https://media.discordapp.net/attachments/811437321593290804/812091805578297374/GitHub-Mark_Dark.png`,
    ]

let m = null,
    n = null

console.log(require('child_process').execSync('node -v').toString())

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
    if (command.aliases) {
        command.aliases.forEach((alias) => {
            client.aliases.set(alias, command)
        })
    }
}

Object.assign(client, {
    cross: '<:cross:790687235376676924>',
    check: '<:checkmark:790687108879613993>',
    developers: [
        '437019658374348801',
        '272659147974115328',
        '779902922674274304',
        '738604939957239930',
    ],
})

client.on('debug', console.log)

client.on('ready', async () => {
    logger.info('READY: Bot has logged in.')
    client.user.setStatus(status)
    for (const guild of client.guilds.cache.values())
        await guild.members.fetch().catch(() => null)
})

client.ws.on('INTERACTION_CREATE', async (interaction) => {
    if (client.channels.cache.get(interaction.channel_id).type == 'dm') return
    client.api
        .interactions(interaction.id)(interaction.token)
        .callback.post({
            data: {
                type: 4,
                data: {
                    content:
                        'Slash commands on this bot are currently not supported in Direct Messages.',
                    flags: 64,
                },
            },
        })

    const message = {
        author: interaction.member.user,
        channel: client.channels.cache.get(interaction.channel_id),
        guild: client.guilds.cache.get(interaction.guild_id),
        content: 'content',
    }
    if (interaction.data.name === 'help') {
        message.content = 'git help'
    } else if (
        interaction.data.name === 'check' &&
        interaction.data.options[0].name === 'repository'
    ) {
        message.content = `git check -repository ${interaction.data.options[0].options[0].value}`
    } else if (
        interaction.data.name === 'check' &&
        interaction.data.options[0].name === 'user'
    ) {
        message.content = `git check -user ${interaction.data.options[0].options[0].value}`
    }

    try {
        client.api
            .interactions(interaction.id)(interaction.token)
            .callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            {
                                color: 9805221,
                                footer: {
                                    text: 'Executed via slash command',
                                },
                            },
                        ],
                        flags: 4,
                    },
                },
            })

        client.emit('message', message)
    } catch (_) {
        client.api
            .interactions(interaction.id)(interaction.token)
            .callback.post({
                data: {
                    type: 5,
                    data: {
                        content: `<@${interaction.member.user.id}>, an error occured during the command execution. Please try again later.`,
                        flags: 64,
                    },
                },
            })
    }
})

client.on('guildMemberAdd', async (member) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(`:tada: **Welcome!** :tada:`)
        .setDescription(
            `We're so glad to have you!  Before you can completely join in on the fun, we need you to verify your GitHub account with us.  Don't worry, we just need to know you have one connected to your Discord account.  [Click here](https://Alternative-Bot.vietnamairlines.repl.co) to verify yourself.`
        )
        .addField(
            `**If you don't have a GitHub account:**`,
            [
                `**1.** Create an account [here](https://github.com/join)`,
                `**2.** Connect it to your Discord Account.  [Need help connecting?](https://support.discord.com/hc/en-us/sections/360007770552-Account-Connections).\n*There currently isn't a guide for GitHub, but it's similar to connecting a Spotify account*`,
                `**3.** Visit [this link](https://Alternative-Bot.vietnamairlines.repl.co) to verify yourself.`,
            ].join('\n')
        )
        .addField(
            `**If you don't have your account connected:**`,
            [
                `**1.** Connect your account to Discord.  [Need help connecting?](https://support.discord.com/hc/en-us/sections/360007770552-Account-Connections).\n*There currently isn't a guide for GitHub, but it's similar to connecting a Spotify account*`,
                `**2.** Visit [this link](https://Alternative-Bot.vietnamairlines.repl.co) to verify yourself.`,
            ].join('\n')
        )
        .setFooter(
            'If you need help, you can reply to this message here in this DM'
        )
        .setColor(`BLURPLE`)
    try {
        await member.send(embed)
    } catch (_) {
        0
    }
})

client.on('message', async (message) => {
    if (message.author.bot) return
    if (!message.channel.type !== 'text') return

    if (message.channel.id === '819385990233849906') {
        if (message.author.id == client.user.id) return
        const res = await fetch(
                `https://discord.com/api/channels/${message.channel.id}/messages/${message.id}/crosspost`,
                {
                    method: 'post',
                    headers: {
                        Authorization: `Bot ${client.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            ),
            json = await res.json()

        console.log(json)

        await msg.delete({
            timeout: 5 * 60 * 1000,
        })
    }

    if (message.content === 'snipe') {
        if (!snipe.message) return message.react(client.cross)
        if (snipe.message.channel.id !== message.channel.id)
            return message.react(client.cross)

        const messageContent = snipe.message.content.replace(/@/g, '@‎'),
            embed = {
                description: [
                    `${
                        snipe.message.content.length < 2048
                            ? messageContent
                            : messageContent.slice(0, 2048 - '...'.length) +
                              '...'
                    }`,
                ].join('\n'),
                color: 0x8b949e,
                image: { url: snipe.attachments || '' },
            }
        message.channel.send({
            embed,
        })
    }
    if (message.channel.id === '819373986160181258') {
        const messageContent = message.content
            .toLowerCase()
            .replace(/\n/g, '\n')

        if (
            ['description:', 'responsibilities:'].some((s) =>
                messageContent.includes(s)
            )
        ) {
            if (
                !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g.test(
                    message.content
                )
            ) {
                message.delete()
            }
            if (m && m.deletable) await m.delete()

            m = await message.channel.send(
                new Discord.Discord.MessageEmbed()
                    .setColor(0x8b949e)
                    .setTitle(`**Contribution Format**`)
                    .setDescription(
                        `\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``
                    )
                    .setColor(0x8b949e)
                    .setThumbnail(
                        'https://cdn.discordapp.com/emojis/819419710889656343.png?v=1'
                    )
            )
            await sleep(5000)
            await message.suppressEmbeds()
        } else {
            if (!message.member.roles.cache.has('811624037356011552'))
                await message.delete()
        }
    }
    if (message.channel.id === '819386292760215562') {
        const messageContent = message.content
            .toLowerCase()
            .replace(/\n/g, '\n')
        if (
            messageContent.startsWith('```') &&
            messageContent.endsWith('```')
        ) {
            if (n && n.deletable) await n.delete()

            n = await message.channel.send(
                new Discord.Discord.MessageEmbed()
                    .setColor(0x8b949e)
                    .setTitle(`**Snippet Format**`)
                    .setDescription(
                        `[\`\`\`Post your snippet in a code block.\`\`\`](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-#:~:text=three%20backticks "For more information about code blocks, click me.")`
                    )
                    .setColor(0x8b949e)
                    .setThumbnail(
                        'https://cdn.discordapp.com/emojis/819419710751768647.png?v=1'
                    )
            )
            await sleep(5000)
            await message.suppressEmbeds()
        } else {
            if (!message.member.roles.cache.has('811624037356011552'))
                await message.delete()
        }
    }

    const args = message.content.split(/ +/),
        command = args.shift().toLowerCase()

    if (!command.startsWith(prefix)) return

    const cmd = client.commands.get(command) || client.aliases.get(command)

    if (!cmd) return

    try {
        cmd.execute(message, args, DEFAULT)
    } catch (error) {
        const embed = new Discord.MessageEmbed()
            .setDescription(
                'There was an error in attempting to execute that command.'
            )
            .setColor('RED')
        await message.reply(embed)
        logger.error(error)
    }
})

client
    .login(process.env.TOKEN)
    .then((_) => {
        let iconIndex = 0
        setInterval(async () => {
            const url = iconList[iconIndex++ % iconList.length],
                firstGuild = client.guilds.cache.get('811436417824718878'),
                secondGuild = client.guilds.cache.get('819390508895305759')
            try {
                await firstGuild.setIcon(url)
                await secondGuild.setIcon(url)
            } catch (err) {
                console.error(err)
            }
        }, 4 * 60 * 60 * 1000)
    })
    .catch((error) => {
        console.error
        logger.error(error)
    })
