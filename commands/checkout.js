const Discord = require('discord.js');
const { MessageEmbed, Collection, Client } = Discord;
const logger = require('../util/log.js');
const fetch = require("node-fetch");

module.exports = {
    name: 'check',
    description: 'Checkout some git stuff',
    usage: null,
    aliases: ["checkout"],
    async execute(message, args, DEFAULT) {
      try {
        const { client } = message;
        const { execSync } = require('child_process');
        const commandType = args[0]
        if (!args[1]) return;
        if (commandType == "-user") {
          let base = await fetch(`https://api.github.com/users/${args[1]}`, {
            method: "get"
          })
          let orgs = await fetch(`https://api.github.com/users/${args[1]}/orgs`, {
            method: "get",
            headers: {
              "Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
            }
          })
          let followers = await fetch(`https://api.github.com/users/${args[1]}/followers`, {
            method: "get",
            headers: {
              "Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
            }
          })
          let following = await fetch(`https://api.github.com/users/${args[1]}/following`, {
            method: "get",
            headers: {
              "Authorization": "token 695ded7c5e50b4075f3420037946976cfbdf35a9"
            }
          })
          base = await base.json()
          orgs = await orgs.json()
          console.log(orgs)
          followers = await followers.json()
          following = await following.json()
          let embed = new Discord.MessageEmbed()
            .setColor(DEFAULT)
            .setFooter(`Created at ${new Date(base.created_at).toLocaleString()} | Last updated at ${new Date(base.updated_at).toLocaleString()}`)
            .setTitle(`**${(base.login == base.name || base.name == null || base.name == undefined) ? base.login : base.login + " (" + base.name + ")"}**`)
            .setURL(`https://github.com/${base.login}`)
            .setThumbnail(base.avatar_url)
            .setDescription(`${base.bio == undefined || base.bio == null ? "" : "```" + base.bio + "```\n"}[${base.followers.toLocaleString()}](https://github.com/${base.login}?tab=followers) Followers • [${base.following.toLocaleString()}](https://github.com/${base.login}?tab=following) Following\n${(base.company == undefined || base.company == null) ? "`" + base.login + " doesn't work anywhere!`" : (base.company.split(" ").length == 2) ? "Works at `" + base.company.split(" ").join(" & ") + "`" : (base.company.split(" ").length > 2) ? "Works at `" + base.company.split(" ").join(", ").split(", ").reverse().replace(", ", " & ").split(", ").reverse().join(", ") + "`" : "Works at `" + base.company + "`"}\n${(base.twitter_username == null || base.twitter_username == undefined) ? "" : "[" + base.login + "'s Twitter](https://twitter.com" + base.twitter_username + ")\n"} ${(base.blog == undefined || base.blog == null || base.blog == "") ? "" : "[" + base.login + "'s website](https://" + base.blog + ")\n"}`)
            let str = ""
            if (followers.length > 10) {
            for (f = 0; f < 10; f++) {
              str += `• [${followers[f].login}](${followers[f].html_url})\n`
            }
            str += "And " + (((base.followers) - 10)).toLocaleString() + " more..."
            } else {
              followers.forEach(f => {
              str += `• [${f.login}](${f.html_url})\n`
            })
            }
            if (str == "") str = `${base.login} doesn't have any followers!`
            embed.addField(`**Followers [${base.followers.toLocaleString()}]:**`, str, true)
            let str1 = ""
            if (following.length > 10) {
            for (f = 0; f < 10; f++) {
              str1 += `• [${following[f].login}](${following[f].html_url})\n`
            }
            str1 += "And " + (((base.following) - 10)).toLocaleString() + " more..."
            } else {
              following.forEach(f => {
              str1 += `• [${f.login}](${f.html_url})\n`
            })
            }
            if (str1 == "") str1 = `${base.login} isn't following anyone!`
            embed.addField(`**Following [${base.following.toLocaleString()}]:**`, str1, true)
            if (orgs == undefined || orgs == null || orgs.length == 0) {
              embed.addField(`**Organizations [0]:**`, `‎${base.login} isn't part of any organizations!`, true)
            } else {
              let final = "";
              orgs.forEach(o => {
                final+= `• [${o.login}](${o.url})\n`
              })
              embed.addField(`**Organizations [${orgs.length}]:**`, "‎" + final, true)
            }
          message.channel.send(embed)
        }
    
    } catch (error) {
      message.channel.send(new Discord.MessageEmbed().setDescription(`User not found.`).setColor(DEFAULT))
    }
    }
}
