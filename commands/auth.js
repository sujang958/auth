const uuid = require('uuid').v4;
const mail = require('../util/sendMail');

module.exports = {
    name: '인증',
    aliases: ['auth'],
    /**
     * @param {import('discord.js').Message} message 
     * @param {string[]} args 
     * @param {import('discord.js').Client} client 
     */
    async run(message, args, client) {
        const guildCT = client.db.db.collection(message.guild.id);
        const guildDB = await client.db.main.findOne({_id: message.guild.id});
        const to = args[0];

        if (!guildDB)
            return message.reply("역할이 설정되어있지 않습니다!, `auth!역할 (역할)` 을 사용하여 역할을 설정하세요!");
        if (!guildDB.role)
            return message.reply("역할이 설정되어있지 않습니다!, `auth!역할 (역할)` 을 사용하여 역할을 설정하세요!");
        if (!to)
            return message.reply("이메일을 입력해주세요!");
        if (!isEmail(to))
            return message.reply("이메일을 입력해주세요!");
        if (!message.guild.me.hasPermission(`ADMINISTRATOR`))
            if (!message.guild.me.hasPermission(`MANAGE_ROLES`))
                return message.reply("권한이 없습니다");
            if (!message.guild.me.hasPermission(`ADD_REACTIONS`))
                return message.reply("권한이 없습니다");
            if (!message.guild.me.hasPermission(`MANAGE_MESSAGES`))
                return message.reply("권한이 없습니다");
        if (!guildDB.channels)
          return message.reply("정해진 채널에서 해주세요");
        if (!guildDB.channels.includes(message.channel.id))
            return message.reply("정해진 채널에서 해주세요");
		if (guildDB.granted)
            if (guildDB.granted.includes(to))
                return message.reply('이미 했습니다');

        let code = '';
        for (let i = 0; i <= 3; i += 0) {
            code = uuid();
            let _ = await guildCT.findOne({_id: code});
            if (!_) break;
        }
            
        await guildCT.insertOne({
            _id: code,
            auth: false,
            userID: message.author.tag,
        });
        await client.db.main.findOneAndUpdate({_id: guildID}, {
            $push: {
                granted: to
            }
        });

        mail.send(mail.createMailOption(to, "디스코드 Auth 봇 인증", `https://auth-bot.sujang.repl.co/auth?userID=${message.author.id}&guildID=${message.guild.id}&code=${code}`));

        return message.reply('메일을 보냈습니다! 메일로 보낸 링크를 확인하세요');
    }
}

// module.exports = {
//     name: "인증",
//     aliases: ["auth", "dlswmd"],
//     /**
//      * @param {Message} message 
//      */
//     async run(message, args, client) {
//         var db = low(new FileSync(`${__dirname}/../auth.json`));
//         var userId = message.author.id;
//         var guildId = message.guild.id;
//         var code = shortId.generate();
//         var to = args[0];
//         var chkDB = db.get(guildId).value();


//         if (chkDB != undefined) {
//             if (chkDB.hasOwnProperty('role')) {
//                 var roleId = chkDB.role;
//             } else {
//                 message.reply('역할이 설정되어있지 않습니다!\n `auth!역할 (역할 멘션)`\n으로 역할을 설정해주세요!');
//                 return;
//             }
//         } else {
//             message.reply('역할이 설정되어있지 않습니다!\n `auth!역할 (역할 멘션)`\n으로 역할을 설정해주세요!');
//             return;
//         }
        


//         if (chkDB != undefined) {
//             if (!isEmail(to)) {
//                 message.reply('이메일을 입력해주세요!')
//                 return;
//             }
//             console.log(chkDB[to.replace('.', '')] == undefined);

//             try {
//                 if (!chkDB[to.replace('.', '')]) {
//                     db.get(guildId).set(code, {
//                         userID: userId,
//                         code: code,
//                         auth: false
//                     }).write()
//                     db.get(guildId).set(`${to.replace('.', '')}`, true).write()

//                     var option = mail.createMailOption(to, "디스코드 Auth 봇 인증", `https://discord-2fa-auth.herokuapp.com/auth?userID=${userId}&guildID=${guildId}&code=${code}`);
//                     mail.send(option);

//                     message.reply(`${args[0]} 로 이메일을 보냈습니다!\n이메일로 보낸 링크로 들어가서 인증을 완료하세요`);
//                     return;
//                 } else {
//                     message.reply('진행중이거나 이미 했습니다!');
//                     return;
//                 }          
//             } catch (e) {
//                 console.log(e);
//                 message.reply('erorr :(');
//             }
//         }    
//     }    
// }



function isEmail(asValue) {
	var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
	return regExp.test(asValue);
}