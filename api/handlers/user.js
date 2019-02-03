const user = require('../controllers/user');

module.exports = {
	login : {
		handler : user.login
	},
	register : {
		handler : user.register
	}
};