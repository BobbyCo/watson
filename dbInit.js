const Sequelize = require('sequelize');
const fs = require('fs');

const {db_path} = require('config.json');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: db_path,
});

fs.readdirSync("./models/").filter(f => f.endsWith('.js')).forEach(table => {
    sequelize.import('./models/' + table);
});

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
