const { default: fetch } = require('node-fetch');
const log = require('../util/log');
const path = require('path');
const { dec } = require('../util/encrypDecryp');

require('dotenv').config();

module.exports =
/**
 * @param {import('express').Application} app 
 */
app => {
    app.get('/docs', (a, b) => b.sendFile(path.join(__dirname, '../htmls/docs.html')));
    app.get('/auth', async (req, res) => {
        const { userID, guildID, code } = req.query;
    
        if (!code || !guildID || !userID) 
            return res.send('<h2>잘못된 요청입니다!</h2>');
    
        /**
         * @type {import('mongodb').Collection}
         */
        const guildCT = app.db.db.collection(guildID);
        const guildDB = await app.db.main.findOne({_id: guildID});
        const codeDB = await guildCT.findOne({_id: code});
        
        if (!guildDB || !guildCT)
            return res.send('<h2>잘못된 요청입니다!</h2>');
        if (!guildDB.role)
            return res.send('<h1>역할이 설정되어있지 않습니다!, `auth!역할 (역할)` 을 사용하여 역할을 설정하세요!</h1>');
        if (!codeDB)
            return res.send('<h1>잘못된 코드입니다</h1>');
        if (codeDB.auth)
            return res.send('<h1>만료된 코드입니다</h1>');
        if (codeDB.userID != userID)
            return res.send('<h1>잘못된 요청입니다</h1>');
        
        try {
            await guildCT.updateOne({_id: code}, {
                $set: {
                    auth: true,
                }
            });
        
            const role_res = await fetch(`https://discord.com/api/v8/guilds/${guildID}/members/${userID}/roles/${guildDB.role}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bot ${dec(process.env.TOKEN)}`,
                }
            });
            
            if (role_res.status > 304)
                return res.send(`<script>alert("봇한테 권한이 없거나 디스코드 오류입니다");location.href="/"</script>`)

            log.web('Auth success', req.ip, code);
            res.send('<script>alert("성공적으로 인증했습니다");location.href="/"</script>');
        } catch (e) {
            console.log(e);
            return res.send(`<script>alert("에러\n${e.toString()}");location.href='/';</script>`);
        }
    });
}