const express = require('express');
const logger = require('morgan');
const compression = require('compression')
const log = require('./util/log');
const MongoDB = require('mongodb');
const cryptFunctions = require('./util/encrypDecryp');
const chalk = require('chalk');

// Variables
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Express
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(compression());
app.use((req, res, next) => {
	log.web(`${req.method} ${req.path} ${chalk.blueBright(res.statusCode)} HTTP ${req.httpVersion} - ${req.ip}`);
	next();
});

require('./router/main')(app);

// Database
app.db = {};
const DBClient = new MongoDB.MongoClient(`mongodb+srv://auth:${cryptFunctions.dec(process.env.DBPW)}@cluster0.q74zk.mongodb.net/auth-bot?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
DBClient.connect().then(async () => {
    app.db.db = DBClient.db('auth-bot');
	app.db.main = DBClient.db('auth-bot').collection('auth');
	log.system('Database Connected');
});

require('./bot')(app.db);
app.listen(PORT, () => {
	log.web(`Web Server Listening on Port ${PORT}`)
});