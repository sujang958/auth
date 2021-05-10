const { Message, MessageEmbed } = require('discord.js');


module.exports = {
    name: "개발자",
    aliases: ['hellothisisverification', 'dev', 'devs'],
    /**
     * 
     * @param {Message} message 
     * @param {Array} args 
     */
    async run(message, args, client) {
        var embed = new MessageEmbed()
        .setTitle('개발자')
        .setAuthor("누군가#4590")
        .setColor("GREEN")
        .addField("공식 웹사이트", "https://auth-1.sujang.repl.co/", false, true)
        .addField("주의사항", "`enter7377@naver.com` 공식 메일입니다!\n다른사람한테 절대로 링크를 보여주지 마세요!\n부정적인 인증방식이 발각될 시 서버 관리자로부터 밴을 받을 수 있습니다", false, true)
        .setFooter("개발자: 누군가#4590")
        .setTimestamp();

        message.reply(embed);
        return;
    }
}