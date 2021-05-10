module.exports = {
    name: '밴',
    aliases: ['ban'],
    /**
     * 
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     * @param {import('discord.js').Client} client 
     */
    async run(message, args, client) {
        if (message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('권한이 없습니다');
        if (!args[0])
            return message.reply('유저를 선택해주세요');

        const user = args[0].replace(/[<@!]/g, '').replace('>', '');

        if (isNaN(user))
            return message.reply('유저를 적어주세요');
        if (!message.guild.members.cache.has(user))
            return message.reply('유저가 존재하지 않습니다');

        message.guild.members.ban(user, {
            reason: `${args[1] ? `${args.slice(1).join(' ')}` : `${message.author.tag} 가 밴함`}`
        });
        message.reply('성공적으로 밴했습니다');
    }
}