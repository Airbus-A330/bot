const fs = require('fs');
const moment = require('moment');
const keepalive = require("./secondary.js");
let m = null;
let n = null;

const {
    Client,
    MessageEmbed,
    Collection
} = require('discord.js');

const client = new Client({
    fetchAllMembers: true
});
var snipe = {};
Object.assign(client, {
    cross: '<:cross:790687235376676924>',
    check: '<:checkmark:790687108879613993>',
    developers: ['437019658374348801', '234464614996246529', '272659147974115328', '779902922674274304']
});

console.log(require('child_process').execSync('node -v').toString());

const { prefix, status } = require('./config.json');
const logger = require('./util/log.js');
const Discord = require('discord.js');

client.on('debug', console.log)

client.on('ready', async () => {
    /*
    const role = client.guilds.cache.get('781930886660751361').roles.cache.get("790831620696965141");
    let guild = client.guilds.cache.get('781930886660751361')
    const member = guild.member('437019658374348801')
    member.roles.remove('790831620696965141')*/

    logger.info("READY: Bot has logged in.");
    client.user.setStatus(status);
/*
    client.channels.cache.get('791204793670172744').messages.fetch('791363015835516968').then(async m => {
        console.log('editing', m.content.length);
        /*await m.edit(`**The Application**
We offer this to test your knowledge of how to moderate a community. This application should take you around 20-30 minutes.

**Questions**
There are 10 moderation-related questions. The first 6 questions are situation-based, where you will be asked to describe what you would do in a specific circumstance. The next 3 are based on general knowledge, and ask about common phrases and terms you'll see quite often when moderating. The last question will ask you about your previous moderation experience (if any) and why you want to be verified by us.

**Passing**
Once you pass, you'll be given the Verified Moderator role which grants you permission to send messages in #verified-jobs. You will maintain this moderator status forever, even if you choose to leave, so don't worry about having to apply again in the future.

**Failing**
Don't worry--if you fail, you can retake the test as many times as you need, with a week of cooldown. While you wait, we advise that you read into #resources related to the reason provided to you when your application was denied.

There is a one hour time limit to help prevent cheating, so please keep this in mind. If you do not complete the test within the time limit, you *will* be able to re-apply immediately, but you will lose your progress, and the questions will be randomized.

If you're ready to apply now, use \`/apply\` in #commands and you'll be given a personalized link to fill out the application. *Do not* share this link with anyone else. Good luck!

**Application Status:** ${client.cross} Offline (Not Released)`);
        console.log('done')*/
    //})

    // client.channels.cache.get('790418063807217685').messages.fetch({ limit: 100 });
    /*setInterval(async () => {
    let { statuses } = require("./config.json");
    const random = Math.floor(Math.random() * statuses.length);
    client.user.setPresence({
      activity: {
            name: `${statuses[random].name}`,
            type: `${statuses[random].type}`,
            url: `${statuses[random].url}`
          }
    })
    }, 30 * 1000)*/
});

// client.on('messageReactionAdd', (reaction, user) => {
//     if (reaction.emoji.name != '📜' && reaction.message.channel.id == '790418063807217685') {
//         console.log('i deleted', reaction.emoji.name);
//         reaction.remove();
//     }
// });

// client.on('messageReactionRemove', (reaction, user) => {
//     if (reaction.emoji.name == '📜' && reaction.message.channel.id == '790418063807217685') {
//         console.log('i put it back');
//         reaction.message.react('📜');
//     }
// })

client.ws.on('INTERACTION_CREATE', async interaction => {
  console.log(interaction.data)
  if (interaction.data.name == "eval") {
    if (!client.developers.includes(message.author.id)) { 
      client.api.interactions(interaction.id)(interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: `<@${interaction.member.user.id}>, you are not an **authorized developer** with clearance to perform this command.`,
          flags: 64
        }
      }
    })
    return;
    }

  }
})

client.on('message', async message => {
	if (message.channel.id == "819385990233849906") {
    if (!message.author.bot) return;
    if (message.author.id == client.user.id) return;
    //let msg = await message.channel.send("<@&813149995569381376>");
    await fetch(`https://discord.com/api/channels/${message.channel.id}/messages/${message.id}/crosspost`, {
        method: 'post',
        headers: {
            Authorization: "Bot "+client.token, //API key here
            'Content-Type': 'application/json'
        },
    })
    .then(res => res.json())
    .then(json => console.log(json));
    await msg.delete({ timeout: 5 * 60 * 1000 });
  }
  if (message.content == "snipe") {
    let tosnipe = snipe
    if (snipe.message == undefined || snipe.message == null) {
      return message.react(client.cross)
    } else {
      if (snipe.message.channel.id !== message.channel.id) {
        return message.react(client.cross)
      }
      
      const embed = {
        "description": [
        `${(tosnipe.message.content.length < 2048) ? tosnipe.message.content.replace(/@/g, "@‎") : tosnipe.message.content.slice(0,2045).replace(/@/g, "@‎") + "..."}`,
        //`**Author: **${tosnipe.message.author.tag} (${tosnipe.message.author.id})`,
        //`**Reference:** ${(tosnipe.message.reference == null) ? "N/A" : "<https://discord.com/channels/"+tosnipe.message.reference.guildID+"/"+tosnipe.message.reference.channelID+"/"+tosnipe.message.reference.messageID+">"}`
      ].join("\n"),
        "color": 0x8b949e//,
        /*"timestamp": tosnipe.message.deleted.timestamp,
        "footer": {
          "text": `Message deleted by ${(tosnipe.auditLog == undefined || tosnipe.auditLog == null) ? "an unknown user" : tosnipe.auditLog.executor.username} during `,
          "icon_url": (tosnipe.auditLog == undefined || tosnipe.auditLog == null) ? "https://images-ext-2.discordapp.net/external/tckGqqLA7QRJiiUn5y9OA0-40vWA1kFh-Dr0Obt7Cus/https/discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png" : tosnipe.auditLog.executor.displayAvatarURL({ dynamic: true })
        }*/
      }
      if (snipe.attachments == undefined || snipe.attachments == null) {

      } else {
        embed.image = { "url": snipe.attachments }
      }
      message.channel.send({embed})
    }
  }
	if (message.channel.id == "819373986160181258") {
    if (message.author.bot) return;
    let text = message.content.toLowerCase().split(" ").join(" ");
            text=text.replace(/\n/g, "\n");
            text=text.replace(/(\r\n|\n|\r)/gm,"\n");
      if (text.includes("description:") && text.includes("responsibilities:")) {
        if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g.test(message.content)) {
          message.delete()
        /*message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please use the following format:\n\n\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``).setColor(0x8b949e)).then(msg => {
          msg.delete({timeout:15000})
        })*/
        }
        if (m == null) {}
        else { m.delete().catch(() => {}) }
        m = await message.channel.send(new Discord.MessageEmbed().setColor(0x8b949e).setTitle(`**Contribution Format**`)
.setDescription(`\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``)
.setColor(0x8b949e)
.setThumbnail("https://cdn.discordapp.com/emojis/819419710889656343.png?v=1"))
        await setTimeout(() => {
          message.suppressEmbeds()
        }, 5000)
      } else {
        if (message.member.roles.cache.has("811624037356011552")) {} else {
        if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g.test(message.content)) {
          message.delete()
        /*message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please use the following format:\n\n\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``).setColor(0x8b949e)).then(msg => {
          msg.delete({timeout:15000})
        })*/
        } else {
        message.delete()
        /*message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please use the following format:\n\n\`\`\`\n[link]\n\n**Description:** (text)\n**Responsibilities:** (text)\`\`\``).setColor(0x8b949e)).then(msg => {
          msg.delete({timeout:15000})
        })*/
        }}
      }

  }
  if (message.channel.id == "819386292760215562") {
    if (message.author.bot) return;
    let text = message.content.toLowerCase().split(" ").join(" ");
            text=text.replace(/\n/g, "\n");
            text=text.replace(/(\r\n|\n|\r)/gm,"\n");
      if (text.startsWith("```") && text.endsWith("```")) {
        if (n == null) {}
        else { n.delete().catch(() => {}) }
        n = await message.channel.send(new Discord.MessageEmbed().setColor(0x8b949e).setTitle(`**Snippet Format**`)
.setDescription(`[\`\`\`Post your snippet in a code block.\`\`\`](https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-#:~:text=three%20backticks "For more information about code blocks, click me.")`)
.setColor(0x8b949e)
.setThumbnail("https://cdn.discordapp.com/emojis/819419710751768647.png?v=1"))
        await setTimeout(() => {
          message.suppressEmbeds()
        }, 5000)
      } else {
        if (message.member.roles.cache.has("811624037356011552")) {} else {
        message.delete()
        /*message.channel.send(new Discord.MessageEmbed().setDescription(`Your post violates our formatting.  Please post your snippet in a code block.`).setColor(0x8b949e)).then(msg => {
          msg.delete({timeout:15000})
        })*/
        }
      }
  }
})

client.on('messageDelete', async message => {
  Object.assign(snipe, {
    message: message
  })
  snipe.message.deleted = { 
    isDeleted: true,
    timestamp: Date.now()
  }
  let attachments = message.attachments.map(a => a.url);
  let file = attachments.toString()
  if (file) {
    snipe.attachments = file
  }
  const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();
  if (!deletionLog) {
    snipe.auditLog = { 
      executor: message.author
    }
  }
  const { executor, target } = deletionLog;
  if (target.id === message.author.id) {
    snipe.auditLog = { 
      executor: executor
    }
  }
  console.log(snipe)
})

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', async message => {
    if (message.author.bot) return;
    
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (!cmd) return;
    try {
        cmd.execute(message, args);
    } catch (error) {
        const embed = new MessageEmbed()
            .setDescription('There was an error in attempting to execute that command.')
            .setColor('RED');
        message.reply(embed).catch(() => null);
        logger.error(error);
    }
});

(async () => {
    try {
        await client.login(process.env.TOKEN);
    } catch (err) {
        logger.error(err);
    }
})();


const iconList = [
    `https://media.discordapp.net/attachments/811437321593290804/812091804811657276/GitHub-Mark.png`,
    `https://media.discordapp.net/attachments/811437321593290804/812091805578297374/GitHub-Mark_Dark.png`
];
let iconIndex = 0;
setInterval(async () => {
    const url = iconList[iconIndex++ % iconList.length];
    const guild = client.guilds.cache.get("811436417824718878");
    try {
        client.user.setAvatar(url)
        guild.setIcon(url)
	    let w = await client.guilds.cache.get("818900769964687410").fetchWebhooks()
w.forEach(wh => {
wh.edit({avatar: url})
})
/*
 if (m !== null) {
        let msg = await client.channels.cache.get("818900769964687410").messages.fetch(m)
        e = new Discord.MessageEmbed(m.embeds[0])
        e.setThumbnail(url)
        msg.edit(e)
 }
 if (n !== null) {
        let msg = await client.channels.cache.get("819386292760215562").messages.fetch(m)
        e = new Discord.MessageEmbed(m.embeds[0])
        e.setThumbnail(url)
        msg.edit(e)
 }*/
    } catch (err) {
        console.error(err);
    }
}, 4 * 60 * 60 * 1000);

