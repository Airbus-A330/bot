const Discord = require('discord.js'),
    client = new Discord.Client(),
    express = require('express'),
    app = express(),
    fetch = require('node-fetch'),
    process = require('process'),
    path = require('path')

function parseToFormData(o) {
    let s = ''
    for (const [k, v] of Object.entries(o)) {
        s += `${k}=${encodeURIComponent(v)}&`
    }
    return s.trim()
}

async function discordOAuth2API(route, token) {
    return await (
        await fetch(`https://discord.com/api${route}`, {
            method: 'get',
            headers: { Authorization: `Bearer ${token}` },
        })
    ).json()
}

app.get('/', function (req, res) {
    return res.sendFile(path.join(__dirname, '/', 'index.html'))
})

app.post('/', async function (req, res) {
    const data = await (
        await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: parseToFormData({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI,
                scope: 'identify connections',
                code: req.body.code,
            }),
        })
    ).json()

    const token = data.access_token,
        connections = discordOAuth2API('/users/@me/connections', token),
        user = discordOAuth2API('/users/@me', token),
        finalized = {
            user: user,
            connections: connections.filter((arr) => arr.type === 'github'),
        }

    if (finalized.connections.length === 0) return res.send(finalized)
    const guild = client.guilds.cache.get('811436417824718878'),
        user = await client.users.fetch(finalized.user.id),
        member = guild.member(user),
        role = guild.roles.cache.find((r) => r.id == '812102444091047997'),
        embed = new Discord.MessageEmbed()
            .setDescription(`Thanks for verifying your GitHub account!`)
            .setColor(`GREEN`)

    member.roles.add(role)

    member.send(embed).catch((error) => {
        client.channels.cache
            .get('811436417824718881')
            .send(`<@${member.id}>`, embed)
    })

    return res.send(finalized)
})

app.listen(8080)
