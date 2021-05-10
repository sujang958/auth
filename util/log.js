const chalk = require('chalk');

module.exports = {
    web(...text) {
       console.log(chalk.greenBright("[Web]"), text.join(' '));
    },
    system(...text) {
        console.log(chalk.cyanBright("[System]"), text.join(' '));
    },
    bot(...text) {
        console.log(chalk.blueBright("[Bot]"), text.join(' '));
    },
}