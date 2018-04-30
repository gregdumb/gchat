const express = require('express');
const models = require('./models');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Express\'d!');
})

const api = express.Router();

api.use('/account', require('./routes/account'));

app.use('/api', api);

module.exports = app;