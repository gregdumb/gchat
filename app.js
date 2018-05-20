const express = require('express');
const cookieParser = require('cookie-parser');
const models = require('./models');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
	res.send('Express\'d!');
})

const api = express.Router();

api.use('/account', require('./routes/account'));
api.use('/user', require('./routes/user'));

app.use('/api', api);

module.exports = app;