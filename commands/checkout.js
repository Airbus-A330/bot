const Discord = require('discord.js'),
    fetch = require('node-fetch'),
    github = require('../util/github')

module.exports = {
    name: 'check',
    description: 'Checkout some git stuff',
    usage: null,
    aliases: ['c', 'checkout'],
    async execute(message, args, DEFAULT, ghtoken) {
        const { client } = message,
         commandType = args.shift(),
         username = args.shift()
        if (!username) return
        message.channel.startTyping()
        try {
            if (commandType === '-user') {
                const data = {
                    base: null,
                    orgs: null,
                    followers: null,
                    following: null,
                }
                await github.checkOut(data, 'users', username)

                const { base, orgs, followers, following } = data,
                    embed = new Discord.MessageEmbed()
                        .setColor(DEFAULT)
                        .setFooter(
                            `Created at ${new Date(
                                base.created_at
                            )} | Last updated at ${new Date(base.updated_at)}`
                        )
                        .setTitle(
                            `**${
                                base.login === base.name || !base.name
                                    ? base.login
                                    : `${base.login} (${base.name})`
                            }**`
                        )
                        .setURL(`https://github.com/${base.login}`)
                        .setThumbnail(base.avatar_url)
                        .setDescription(
                            `${!base.bio ? '' : '```' + base.bio + '```\n'}[${
                                base.followers
                            }](https://github.com/${
                                base.login
                            }?tab=followers) Followers • [${
                                base.following
                            }](https://github.com/${
                                base.login
                            }?tab=following) Following\n${
                                !base.company
                                    ? '`' +
                                      base.login +
                                      " doesn't work anywhere!`"
                                    : base.company.split(' ').length == 2
                                    ? 'Works at `' +
                                      base.company.split(' ').join(' & ') +
                                      '`'
                                    : base.company.split(' ').length > 2
                                    ? 'Works at `' +
                                      base.company.split(' ').join(', ') +
                                      '`'
                                    : 'Works at `' + base.company + '`'
                            }\n${
                                !base.twitter_username
                                    ? ''
                                    : `[${base.login}'s Twitter](https://twitter.com/${base.twitter_username})\n`
                            } ${
                                !base.blog
                                    ? ''
                                    : `[${base.login}'s website](https://${base.blog})\n`
                            }`
                        )

                let str = github.parseAPIResponse(followers, base.followers)
                if (!str) str = `${base.login} doesn't have any followers!`

                embed.addField(`**Followers [${base.followers}]:**`, str, true)

                let str = github.parseAPIResponse(following, base.following)
                if (!str) str = `${base.login} isn't following anyone!`

                embed.addField(`**Following [${base.following}]:**`, str, true)

                if (!orgs) {
                    embed.addField(
                        `**Organizations [0]:**`,
                        `‎${base.login} isn't part of any organizations!`,
                        true
                    )
                } else {
                    let final = ''
                    for (const o of orgs) final += `• [${o.login}](${o.url})\n`
                    embed.addField(
                        `**Organizations [${orgs.length}]:**`,
                        final,
                        true
                    )
                }

                message.channel.stopTyping(true)
                message.channel.send(embed)
            } else if (['-repo', '-repository'].includes(commandType)) {
                const data = {
                    base: null,
                    stars: null,
                    contributors: null,
                    forks: null,
                }

                await github.checkOut(data, 'repos', username)

                const { base, stars, contributors, forks } = data,
                    embed = new Discord.MessageEmbed()
                        .setColor(DEFAULT)
                        .setFooter(
                            `Created at ${new Date(
                                base.created_at
                            )} | Last updated at ${new Date(base.updated_at)}`
                        )
                        .setAuthor(base.owner.login, base.owner.avatar_url)
                        .setTitle(
                            `**${
                                base.private == true
                                    ? client.emojis.cache
                                          .get('821537741237780540')
                                          .toString() + ' '
                                    : ''
                            }‎${
                                base.fork == true
                                    ? client.emojis.cache
                                          .get('821571148155191297')
                                          .toString() + ' '
                                    : ''
                            }‎${base.name}**`
                        )
                        .setURL(base.html_url)
                        .setDescription(
                            `${
                                !base.description
                                    ? ''
                                    : '```' + base.description + '```\n'
                            }[${base.stargazers_count}](https://github.com/${
                                username
                            }/stargazers) Star${
                                base.stargazers_count <= 1 ? '' : 's'
                            } • [${base.watchers_count}](https://github.com/${
                                username
                            }/watchers) Watcher${
                                base.watchers_count <= 1 ? '' : 's'
                            } • [${base.forks_count}](https://github.com/${
                                username
                            }/network/members) Fork${
                                base.forks_count <= 1 ? '' : 's'
                            }\n[${
                                base.open_issues_count
                            }](https://github.com/discord/discord-api-docs/issues) Open Issue${
                                base.open_issues_count <= 1 ? '' : 's'
                            }\n${
                                !base.license
                                    ? '`This repository has no license!`'
                                    : `License: [\`${base.license.name}\`](https://github.com/${username}/blob/master/LICENSE)`
                            }`
                        )

                if (!base.license) {
                    embed.addField(
                        `**License:**`,
                        'This repository does not have a license!'
                    )
                } else if (base.license.key === 'other') {
                    embed.addField(
                        `**License:**`,
                        "This license is listed under the `Other` category. That's all we know."
                    )
                } else {
                    const license = await (
                            await fetch(
                                `https://api.github.com/licenses/${base.license.key}`,
                                {
                                    method: 'get',
                                    headers: {
                                        Authorization:
                                            'token ' + process.env.GITHUB_TOKEN,
                                    },
                                }
                            )
                        ).json(),
                        string = `• Description: \`${
                            license.description
                        }\`\n• Permissions: \`${license.permissions.join(
                            ', '
                        )}\`\n• Conditions:\`${license.conditions.join(
                            ', '
                        )}\`\n• Limitations: \`${license.limitations.join(
                            ', '
                        )}\``

                    embed.addField(`**License:**`, string)
                }

                if (stars.length === 0) {
                    embed.addField(
                        `**Stargazers [0]:**`,
                        'This repository has no stars!',
                        true
                    )
                } else {
                    let str = github.parseAPIResponse(
                        stars,
                        base.stargazers_count
                    )
                    if (!str) str = `• [${stars.login}](${stars.html_url})\n`
                    embed.addField(
                        `**Stargazers [${base.stargazers_count}]:**`,
                        str,
                        true
                    )
                }

                if (contributors.length == 0) {
                    embed.addField(
                        `**Contributors [0]:**`,
                        'This repository has no contributors!',
                        true
                    )
                } else {
                    let str = github.parseAPIResponse(
                        contributors,
                        contributors.length
                    )
                    if (!str)
                        str = `• [${contributors.login}](${contributors.html_url})\n`
                    embed.addField(
                        `**Contributors [${contributors.length}]:**`,
                        str,
                        true
                    )
                }

                if (forks.length == 0) {
                    embed.addField(
                        `**Forks [0]:**`,
                        'This repository has no forks!',
                        true
                    )
                } else {
                    let str = github.parseAPIResponse(forks, base.forks_count)
                    if (!str) str = `• [${forks.login}](${forks.html_url})\n`
                    embed.addField(
                        `**Forks [${base.forks_count}]:**`,
                        str,
                        true
                    )
                }
                message.channel.stopTyping(true)
                message.channel.send(embed)
            }
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
