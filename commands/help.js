const { Message, MessageEmbed } = require('discord.js');
const commandsList = [
    [
        {
            name: 'auth!인증 (이메일)',
            value: '(이메일) 로 인증 링크를 보내고 인증 링크를 접속하면 인증이 완료됩니다'
        },
        {
            name: 'auth!핑',
            value: '봇의 핑을 확인합니다',
        },
        {
            name: 'auth!개발자',
            value: '개발자를 확인합니다',
        },
        {
            name: 'auth!채널',
            value: '어디에서 인증할수 있는지 확인합니다',
        },
        {
            name: 'auth!역할',
            value: '인증을 했을때 무슨 역할을 받는지 확인합니다',
        }
    ],
    [
        {
            name: 'auth!밴 (유저)',
            value: '(유저)를 밴합니다',
        },
        {
            name: 'auth!채널 (채널)',
            value: '인증할 수 있는 채널을 설정합니다',
        },
        {
            name: 'auth!역할 (역할)',
            value: '인증을 했을때 무슨 역할을 받는지 설정합니다',
        },
        {
            name: '준비중',
            value: '준비중'
        },
        {
            name: '준비중',
            value: '준비중'
        },
    ]
]
const commandsType = [
    '유저 명령어',
    '어드민 명령어',
]


module.exports = {
    name: "도움",
    aliases: ['help', '도움말', '명령어'],
    /**
     * @param {Message} message 
     */
    async run(message, args, client) {
        let page = 1, pageMax = commandsList.length;
        let embedJSON = {
            title: "명령어 목록",
            color: "GREEN",
            description: commandsType[page-1],
            fields: commandsList[page - 1],
            timestamp: new Date(),
        }
        let pageMessage = await message.channel.send({embed: embedJSON});
        pageMessage.react(`⬅`).then(() => pageMessage.react('➡'));

        const backwardReactFilter = (reaction, user) => reaction.emoji.name == "⬅" && user.id === message.author.id;
        const forwardReactFilter = (reaction, user) => reaction.emoji.name == "➡" && user.id === message.author.id;

        const forward = pageMessage.createReactionCollector(forwardReactFilter, {tiem: 60000});
        const backward = pageMessage.createReactionCollector(backwardReactFilter, {tiem: 60000});

        forward.on('collect', async r => {
            r.users.remove(message.author.id);
            if (page == pageMax) return;
            page += 1;
            embedJSON.fields = commandsList[page - 1];
            embedJSON.description = commandsType[page - 1];
            pageMessage.edit({embed: embedJSON});
        });

        backward.on('collect', async r => {
            r.users.remove(message.author.id);
            if (page == 1) return;
            page -= 1;
            embedJSON.fields = commandsList[page - 1];
            embedJSON.description = commandsType[page - 1];
            pageMessage.edit({embed: embedJSON});
        });
        // if (args[0] == undefined) {
        //     var embed = new MessageEmbed()
        //     .setTitle("명령어 목록")
        //     .setColor("GREEN")
        //     .setDescription("유저 명령어")
        //     .addField("auth!역할 (역할)", "자세한 정보는 `auth!도움 역할` 로 확인하세요", false, true)
        //     .addField("auth!인증 (이메일)", "자세한 정보는 `auth!도움 인증` 으로 확인하세요", false, true)
        //     .addField("auth!채널 (채널)", "인증할 채널을 다정합니다\n자세한 정보는 `auth!도움 채널` 으로 확인하세요", false, true)
		// 	.addField("auth!핑", "봇의 핑을 확인합니다", false, true)
        //     .setFooter("개발자: 누군가#4590")
        //     .setTimestamp();

        //     message.reply(embed);
        //     return;
        // } else {
        //     if (args[0] == '역할') {
        //         var embed = new MessageEmbed()
        //         .setAuthor("명령어 정보")
        //         .setColor("#ffffff")
        //         .addField("문법", "`auth!역할 (역할)`", false, true)
        //         .addField("설명", "사용자가 인증을 했을때 받을 역할을 지정합니다", false, true)
        //         .setFooter("개발자: 누군가#4590")
        //         .setTimestamp();

        //         message.reply(embed);
        //         return;
        //     } else if (args[0] == '인증') {
        //         var embed = new MessageEmbed()
        //         .setAuthor("명령어 정보")
        //         .setColor("#ffffff")
        //         .addField("문법", "`auth!인증 (이메일)`", false, true)
        //         .addField("설명", "(이메일) 로 인증 링크를 보내고 인증 링크를 접속하면 인증이 완료됩니다", false, true)
        //         .setFooter("개발자: 누군가#4590")
        //         .setTimestamp();

        //         message.reply(embed);
        //         return;
        //     } else if (args[0] == '채널') {
        //         var embed = new MessageEmbed()
        //         .setAuthor("명령어 정보")
        //         .setColor("#ffffff")
        //         .addField("문법", "`auth!채널 (채널)`", false, true)
        //         .addField("설명", "인증할 채널을 설정합니다, 여러개의 채널을 설정할 수도 있습니다", false, true)
        //         .setFooter("개발자: 누군가#4590")
        //         .setTimestamp();

        //         message.reply(embed);
        //         return;
        //     }
        // }
    }
}