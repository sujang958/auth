const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "역할",
    aliases: ['setrole', 'role'],
    /**
     * @param {import('discord.js').Message} message 
     * @param {string[]} args
     * @param {import('discord.js').Client} client
     */
    async run(message, args, client) {
        const roleID = args[0].replace(/[<@&]/g, '').replace('>', '');
        const guildDB = await client.db.main.findOne({_id: message.guild.id});

        if (!message.member.hasPermission('ADMINISTRATOR'))
            return message.reply('관리자 권한이 필요합니다');
        if (!args[0])
            return message.reply('역할을 적어주세요!');
        if (isNaN(roleID))
            return message.reply('역할을 적어주세요!');
        if (!guildDB)
            await client.db.main.insertOne({_id: message.guild.id});

        const hasRole = message.guild.roles.cache.has(roleID);
        console.log(hasROle);
        if (!hasRole)
            return message.reply('존재하지 않는 역할입니다');
        if (guildDB) {
            try {
                const chkEmbed = new MessageEmbed()
                    .setTitle(`정말로 역할을 바꾸시겠습니까?`)
                    .setDescription(`선택하신 역할로 변경됩니다`)
                    .setColor('ORANGE')
                    .setTimestamp()
                    .setFooter(`${message.author.tag}\u200b`, message.author.displayAvatarURL());
                const chkMsg = await message.reply(chkEmbed);

                await chkMsg.react(`✅`);
                await chkMsg.react('❌');

                const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        
                const collected = await chkMsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] });
                const reaction = collected.first();
            
                if (reaction.emoji.name == '✅') {
                    await client.db.main.updateOne({_id: message.guild.id}, {$set: {role: roleID}});
                    return chkMsg.edit('바꿨습니다');
                } else {
                    return message.reply('취소하였습니다');
                }
            } catch (e) {
                console.log(e);
                return message.reply('취소하였습니다');
            }
        }
    }
}