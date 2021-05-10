var nodemailer = require('nodemailer');
var dotenv = require('dotenv');
var crypFunction = require('./encrypDecryp');
dotenv.config();

var transporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    auth: {
        user: process.env.ID,
        pass: crypFunction.dec(process.env.PW)
    }
});

/**
 * 
 * @param {JSON} mailOptions 
 */

function send(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return new Error(error)
        }
        else {
            return info
        }
    });
}

function createMailOption(email, title, description) {
    var mailOptions = {
        from: 'enter7377@naver.com',
        to: email,
        subject: title,
        text: description,
    };

    return mailOptions;
}


module.exports = {
    send,
    createMailOption
}