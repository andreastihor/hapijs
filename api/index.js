const user = require('./handlers/user.js');
const article = require('./handlers/article.js');

module.exports = {
	register: (server) => {
		server.route([

			{method : 'GET' , path : '/' , options : article.home},
			{method : 'POST' , path : '/login' , options : user.login},
			{method : 'POST' , path : '/register' , options : user.register},
			

		])
	},
	name: 'api-plugin'
};