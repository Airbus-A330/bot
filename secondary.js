const Discord = require('discord.js');
const client = new Discord.Client();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');
const data = new FormData();

const axios = require("axios")
const process = require("process")
app.use(bodyParser.text());
const token = process.env.TOKEN
let m = null;
var _ = require('lodash');

client.on("guildMemberAdd", async member => {
  let embed = new Discord.MessageEmbed()
    .setTitle(`:tada: **Welcome!** :tada:`)
    .setDescription(`We're so glad to have you!  Before you can completely join in on the fun, we need you to verify your GitHub account with us.  Don't worry, we just need to know you have one connected to your Discord account.  [Click here](https://Alternative-Bot.vietnamairlines.repl.co) to verify yourself.`)
    .addField(`**If you don't have a GitHub account:**`, [
      `**1.** Create an account [here](https://github.com/join)`,
      `**2.** Connect it to your Discord Account.  [Need help connecting?](https://support.discord.com/hc/en-us/sections/360007770552-Account-Connections).\n*There currently isn't a guide for GitHub, but it's similar to connecting a Spotify account*`,
      `**3.** Visit [this link](https://Alternative-Bot.vietnamairlines.repl.co) to verify yourself.`
    ].join("\n"))
    .addField(`**If you don't have your account connected:**`, [
      `**1.** Connect your account to Discord.  [Need help connecting?](https://support.discord.com/hc/en-us/sections/360007770552-Account-Connections).\n*There currently isn't a guide for GitHub, but it's similar to connecting a Spotify account*`,
      `**2.** Visit [this link](https://Alternative-Bot.vietnamairlines.repl.co) to verify yourself.`
    ].join("\n"))
    .setFooter("If you need help, you can reply to this message here in this DM")
    .setColor(`BLURPLE`)
//client.channels.cache.get("811436417824718881").send(`<@${member.id}>`, embed)
})
/*
client.on("ready", async () => {
  await setInterval(async () => {
    const statuslist = [
      `https://media.discordapp.net/attachments/811437321593290804/812091804811657276/GitHub-Mark.png`,
      `https://media.discordapp.net/attachments/811437321593290804/812091805578297374/GitHub-Mark_Dark.png`
    ];
    const random = Math.floor(Math.random() * statuslist.length);

    try {
     client.user.setAvatar(statuslist[random])
     client.guilds.cache.get("811436417824718878").setIcon(statuslist[random])
    } catch (error) {
      console.error(error);
    }
  }, 12 * 60 * 60 * 1000);
  //}, 5 * 1000);
})
*/
/*
client.on("message", async message => {
  if (message.channel.id == "812118817815134248") {
    if (!message.author.bot) return;
    if (message.author.id == client.user.id) return;
    let msg = await message.channel.send("<@&813149995569381376>");
    await fetch(`https://discord.com/api/channels/${message.channel.id}/messages/${message.id}/crosspost`, {
        method: 'post',
        headers: {
            Authorization: "Bot "+client.token, //API key here
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(json => console.log(json));
    await msg.delete({ timeout: 3 * 60 * 1000 });
  }
  if (message.channel.id == "819373986160181258") {
    if (message.author.bot) return;
    let text = message.content.toLowerCase().split(" ").join(" ");
            text=text.replace(/\n/g, "\n");
            text=text.replace(/(\r\n|\n|\r)/gm,"\n");
      if (text.includes("description:") && text.includes("responsibilities:")) {
        if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g.test(message.content)) {
          message.delete()
        message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please use the following format:\n\n\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``).setColor(0x2F3136)).then(msg => {
          msg.delete({timeout:15000})
        })
        }
        if (m == null) {}
        else { m.delete().catch(() => {}) }
        m = await message.channel.send(new Discord.MessageEmbed().setColor(0x2F3136).setTitle(`**Contribution Format**`)
.setDescription(`\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``)
.setColor(0x2F3136)
.setThumbnail(client.user.displayAvatarURL())
.setFooter(`Follow this format, or your post will be deleted`))
        await setTimeout(() => {
          message.suppressEmbeds()
        }, 5000)
      } else {
        if (message.member.roles.cache.has("811624037356011552")) {} else {
        if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g.test(message.content)) {
          message.delete()
        message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please use the following format:\n\n\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``).setColor(0x2F3136)).then(msg => {
          msg.delete({timeout:15000})
        })
        } else {
        message.delete()
        message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please use the following format:\n\n\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``).setColor(0x2F3136)).then(msg => {
          msg.delete({timeout:15000})
        })
        }}
      }
  }
  if (message.channel.id == "819386292760215562") {
    if (message.author.bot) return;
    let text = message.content.toLowerCase().split(" ").join(" ");
            text=text.replace(/\n/g, "\n");
            text=text.replace(/(\r\n|\n|\r)/gm,"\n");
      if (text.startsWith("```") && text.endsWith("```")) {
        if (m == null) {}
        else { m.delete().catch(() => {}) }
        m = await message.channel.send(new Discord.MessageEmbed().setColor(0x2F3136).setTitle(`**Snippet Format**`)
.setDescription(`Post your snippet in a code block.`)
.setColor(0x2F3136)
.setThumbnail(client.user.displayAvatarURL())
.setFooter(`Follow this format, or your post will be deleted`))
        await setTimeout(() => {
          message.suppressEmbeds()
        }, 5000)
      } else {
        if (message.member.roles.cache.has("811624037356011552")) {} else {
        message.delete()
        message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please post your snippet in a code block.`).setColor(0x2F3136)).then(msg => {
          msg.delete({timeout:15000})
        })
        }
      }
  }
})
*/

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/', async function (req, res) {
  console.log("got a post req")
    data.append('client_id', process.env.CLIENT_ID);
    data.append('client_secret', process.env.CLIENT_SECRET);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', process.env.REDIRECT_URI);
    data.append('scope', 'identify connections');
    data.append('code', req.body);

    fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: data,
    })
        .then(response => response.json())
        .then(async data=>{
            console.log(data)
            const config = {
                headers:{
                    "authorization":`Bearer ${data.access_token}`
                }
            }
            let r1 = await axios
                .get("https://discord.com/api/users/@me/connections",config)
                .catch(error=>{
                    console.log(error)
                })
            let r2 = await axios
                .get("https://discord.com/api/users/@me",config)
                .catch(error=>{
                    console.log(error)
                })
            let finalized = {
              user: r2.data,
              connections: r1.data.filter(arr => arr.type == "github")
            }
            console.log(finalized)
            if (finalized.connections.length !== 0) {
              let guild = client.guilds.cache.get("811436417824718878")
              let user = await client.users.fetch(finalized.user.id)
              let member = guild.member(user)
              console.log(user)
              let role = guild.roles.cache.find(r => r.id == "812102444091047997")
              member.roles.add(role)
              member.send(new Discord.MessageEmbed().setDescription(`Thanks for verifying your GitHub account!`).setColor(`GREEN`)).catch(error => {
                client.channels.cache.get("811436417824718881").send(`<@${member.id}>`, new Discord.MessageEmbed().setDescription(`Thanks for verifying your GitHub account!`).setColor(`GREEN`))
              })
            }
            res.send(finalized)
        })
})
app.listen(8080)

const iconList = [
    `https://media.discordapp.net/attachments/811437321593290804/812091804811657276/GitHub-Mark.png`,
    `https://media.discordapp.net/attachments/811437321593290804/812091805578297374/GitHub-Mark_Dark.png`
];
let iconIndex = 0;
setInterval(async () => {
    const url = iconList[iconIndex++ % iconList.length];
    const guild = client.guilds.cache.get("811436417824718878");
    try {
        if (m == null) return;
        let msg = await client.channels.cache.get("812312981949906964").messages.fetch(m)
        e = new Discord.MessageEmbed(m.embeds[0])
        e.setThumbnail(client.user.displayAvatarURL())
        msg.edit(e)
    } catch (err) {
        console.error(err);
    }
}, 4 * 60 * 60 * 1000);

/*
client.on('messageUpdate', (m1, m2) => {
  if (m2.author.bot) return;
  if (m2.embeds.length !== 0) return;
  message = m2
  client.emit("message", m2)
})*/
/*
client.on("message", async message => {
  if (message.channel.id == "818518839146184725") {
    if (!/(thanks|thank you)/gi.test(message.content)) return;
    let mentions = message.mentions.users
    if (mentions.size == 0) return;
    let arr = []
    console.log(mentions)
    for (let [id, user] of mentions) {
      arr.push(user)
    }
    message.channel.send(new Discord.MessageEmbed().setColor(0x2F3136).setDescription(`Thanks for your help, ${arr.join(" & ")}!  You ${(arr.length == 1) ? "have" : (arr.length == 2) ? "both": "all" } received **1 point** for your help!`))
  }
})*/

client.login(token)