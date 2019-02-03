const db = require('./DB.js');
const Sequelize = require('sequelize')

const User = db.define('user', {
	fullname : Sequelize.TEXT,
	email : Sequelize.TEXT,
	password : Sequelize.TEXT,
	username : Sequelize.TEXT,
	dob : Sequelize.INTEGER

});

User.sync();

module.exports = {
	User
}