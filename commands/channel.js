const { MessageEmbed } = require('discord.js');

module.exports = {
    name: '채널',
    aliases: ['channel', '채널설정'],
    /**
     * 
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     * @param {import('discord.js').Client} client 
     */
    async run(message, args, client) {
        const guildDB = await client.db.main.findOne({_id: message.guild.id});
        const channelID = args[0].replace(/[<#!&]/g, '').replace('>', '');

        if (!message.member.hasPermission('ADMINISTRATOR'))
            return message.reply('관리자 권한이 필요합니다');
        if (!channelID || isNaN(channelID))
            return message.reply('채널을 적어주세요');
        if (!guildDB)
            await client.db.main.insertOne({_id: message.guild.id});

        const channel = client.channels.cache.get(channel);
        
        if (!channel.isText())
            return message.reply('텍스트 채널이 아닙니다');
        
        try {
            const chkEmbed = new MessageEmbed()
                .setTitle(`정말로 채널을 설정하겠습니까?`)
                .setDescription(`선택하신 채널로 설정됩니다`)
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
                await client.db.main.updateOne({_id: message.guild.id}, {$push: {channel: roleID}});
                return chkMsg.edit('바꿨습니다');
            } else {
                return message.reply('취소하였습니다');
            }
        } catch (e) {
            console.log(e);
            return message.reply('취소했습니다');
        }
    }
}