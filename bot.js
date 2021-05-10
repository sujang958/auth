const Discord = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const MongoDB = require('mongodb');
const cryptFunctions = require('./util/encrypDecryp');
const chalk = require('chalk');
const log = require('./util/log');

dotenv.config();

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commandFiles = fs.readdirSync(`${__dirname}/commands/`).filter(file => file.endsWith('.js'));
const tableData = [];
for (const file of commandFiles) {
	try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);

        for (const alias of command.aliases) {
            client.aliases.set(alias, command.name);
        }
        tableData.push({
            status: "✅",
            name: command.name,
            error: undefined,
        });

        continue;
    } catch (e) {
        try {
            tableData.push({
                status: "❌",
                name: command.name,
                error: e.toString(),
            });
            continue;
        } catch (error) {
            tableData.push({
                status: "❌",
                name: undefined,
                error: e.toString(),
            });
            continue;
        }
    }
}
console.table(tableData);

client.once('ready', () => {
    log.bot('login on ' + client.user.tag);
});

client.on('ready', async () => {
    setInterval(() => {
        client.guilds.cache.map(async guild => {
            const guildDB = await client.db.main.findOne({_id: guild.id});

            if (!guild)
                return;
            if (!client.db.db.collection(guild.id)) 
                await client.db.db.createCollection(guild.id);  
            if (!guildDB) 
                await client.db.main.insertOne({_id: guild.id}, {granted: []});
        });
    }, 3000);
});

client.once("reconnecting", () => {
    client.user.setActivity('다시 연결하는 중');
    log.bot("reconnecting");
});

client.once("disconnect", () => {
    client.user.setActivity('뷁')
    log.bot("disconnecting");
});

client.on('message', async message => {
    const PREFIX = process.env.PREFIX;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.mentions.users.has(client.user.id)) client.commands.get('도움').run(message, []);
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length == 0) return;

    if (client.commands.get(cmd)) {
        log.bot(`${message.author.tag} - ${message.content} : ${new Date()}`)
        return client.commands.get(cmd).run(message, args, client);
    } else if (client.aliases.get(cmd)) {
        log.bot(`${message.author.tag} - ${message.content} : ${new Date()}`)
        return client.commands.get(client.aliases.get(cmd)).run(message, args, client);
    }
})
    
module.exports = db => {
    client.db = db;
    client.login(cryptFunctions.dec(process.env.TOKEN));
}