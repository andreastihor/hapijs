const Sequelize = require('sequelize');
const db = new Sequelize('test','postgres','admin',{
	dialect : 'postgresql'
});

module.exports  = db;